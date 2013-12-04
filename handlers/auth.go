package handlers

import (
	"bytes"
	"encoding/json"
	// "fmt"
	"github.com/gorilla/mux"
	"github.com/gorilla/sessions"
	"github.com/wurkhappy/WH-Config"
	"html/template"
	"log"
	"net/http"
)

// var authTemplates = template.Must(template.ParseFiles("templates/login.html", "templates/newAccount.html"))

func PostLogin(w http.ResponseWriter, req *http.Request, session *sessions.Session) {

	buf := new(bytes.Buffer)
	buf.ReadFrom(req.Body)
	resp, statusCode := sendServiceRequest("POST", config.UserService, "/auth/login", buf.Bytes())
	log.Print(string(resp))
	if statusCode >= 400 {
		var rError *responseError
		json.Unmarshal(resp, &rError)
		http.Error(w, rError.Description, statusCode)
		return
	}

	var requestData map[string]interface{}
	json.Unmarshal(resp, &requestData)

	session.Values["id"] = requestData["id"].(string)
	session.Values["isVerified"] = requestData["isVerified"].(bool)
	session.Save(req, w)

	w.Write([]byte(`{"redirectURL":"/home"}`))
}

func Logout(w http.ResponseWriter, req *http.Request, session *sessions.Session) {

	session.Options.MaxAge = -1
	session.Save(req, w)

	http.Redirect(w, req, "/", http.StatusFound)
}

func VerifyUser(w http.ResponseWriter, req *http.Request, session *sessions.Session) {
	vars := mux.Vars(req)
	id := vars["id"]

	resp, statusCode := sendServiceRequest("POST", config.UserService, "/user/"+id+"/verify", nil)
	if statusCode >= 400 {
		var rError *responseError
		json.Unmarshal(resp, &rError)
		http.Error(w, rError.Description, statusCode)
		return
	}

	var requestData map[string]interface{}
	json.Unmarshal(resp, &requestData)

	session.Values["id"] = requestData["id"].(string)
	session.Values["isVerified"] = requestData["isVerified"].(bool)
	session.Save(req, w)
	http.Redirect(w, req, "/home", http.StatusFound)

}

func ForgotPassword(w http.ResponseWriter, req *http.Request, session *sessions.Session) {
	buf := new(bytes.Buffer)
	buf.ReadFrom(req.Body)
	resp, statusCode := sendServiceRequest("POST", config.UserService, "/password/forgot", buf.Bytes())
	if statusCode >= 400 {
		var rError *responseError
		json.Unmarshal(resp, &rError)
		http.Error(w, rError.Description, statusCode)
		return
	}
	w.Write([]byte(`{}`))
}

func GetNewPasswordPage(w http.ResponseWriter, req *http.Request, session *sessions.Session) {
	//user gets 10 mins to change their password
	session.Options.MaxAge = 10 * 60
	session.Save(req, w)

	user := struct {
		ID string `json:"id"`
	}{
		session.Values["id"].(string),
	}
	m := map[string]interface{}{
		"appName":    "mainnewpassword",
		"user":       user,
		"production": Production,
		"JSversion":  JSversion,
		"CSSversion": CSSversion,
	}
	var index = template.Must(template.ParseFiles(
		"templates/_baseApp.html",
		"templates/forgot_password.html",
	))
	index.Execute(w, m)
}

func SetNewPassword(w http.ResponseWriter, req *http.Request, session *sessions.Session) {
	buf := new(bytes.Buffer)
	buf.ReadFrom(req.Body)
	resp, statusCode := sendServiceRequest("PUT", config.UserService, "/user/"+session.Values["id"].(string)+"/password", buf.Bytes())
	if statusCode >= 400 {
		var rError *responseError
		json.Unmarshal(resp, &rError)
		http.Error(w, rError.Description, statusCode)
		return
	}

	//if they were successful setting a new password then we treat that as a login and extend their session
	session.Options.MaxAge = 24 * 60 * 60
	session.Save(req, w)
	w.Write([]byte(`{"redirectURL":"/home"}`))
}
