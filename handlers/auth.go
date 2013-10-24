package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	"github.com/gorilla/sessions"
	"html/template"
	// "log"
	"net/http"
)

// var authTemplates = template.Must(template.ParseFiles("templates/login.html", "templates/newAccount.html"))

func PostLogin(w http.ResponseWriter, req *http.Request, session *sessions.Session) {

	client := &http.Client{}
	r, _ := http.NewRequest("POST", "http://localhost:3000/auth/login", req.Body)
	resp, err := client.Do(r)
	if err != nil {
		fmt.Printf("Error : %s", err)
	}

	if resp.StatusCode >= 400 {
		var rError *responseError
		dec := json.NewDecoder(resp.Body)
		dec.Decode(&rError)
		http.Error(w, rError.Description, rError.StatusCode)
		return
	}

	var requestData map[string]interface{}
	buf := new(bytes.Buffer)
	buf.ReadFrom(resp.Body)
	respBytes := buf.Bytes()
	json.Unmarshal(respBytes, &requestData)

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
	req.ParseForm()
	vars := mux.Vars(req)
	id := vars["id"]

	r, _ := http.NewRequest("POST", "http://localhost:3000/user/"+id+"/verify", nil)
	requestData, _ := sendRequest(r)

	session.Values["id"] = requestData["id"].(string)
	session.Values["isVerified"] = requestData["isVerified"].(bool)
	session.Save(req, w)
	http.Redirect(w, req, "/account", http.StatusFound)

}

func ForgotPassword(w http.ResponseWriter, req *http.Request, session *sessions.Session) {
	r, _ := http.NewRequest("POST", "http://localhost:3000/password/forgot", req.Body)
	_, respBytes := sendRequest(r)
	rError := new(responseError)
	json.Unmarshal(respBytes, &rError)
	if rError.StatusCode >= 400 {
		http.Error(w, rError.Description, rError.StatusCode)
		return
	}
	w.Write([]byte(`{}`))
}

func GetNewPasswordPage(w http.ResponseWriter, req *http.Request, session *sessions.Session) {

	user := struct {
		id string
	}{
		session.Values["id"].(string),
	}
	var index = template.Must(template.ParseFiles(
		"templates/_baseApp.html",
		"templates/forgot_password.html",
	))
	index.Execute(w, user)
}

func SetNewPasswordPage(w http.ResponseWriter, req *http.Request, session *sessions.Session) {
	r, _ := http.NewRequest("POST", "http://localhost:3000/password/forgot", req.Body)
	requestData, _ := sendRequest(r)

	session.Values["id"] = requestData["id"].(string)
	session.Values["isVerified"] = requestData["isVerified"].(bool)
	session.Save(req, w)
	http.Redirect(w, req, "/account", http.StatusFound)
}
