package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	"github.com/gorilla/sessions"
	// "html/template"
	"log"
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
		log.Print("error")
		errorBuf := new(bytes.Buffer)
		errorBuf.ReadFrom(resp.Body)
		errorBytes := errorBuf.Bytes()
		http.Error(w, string(errorBytes), resp.StatusCode)
		return
	}

	var requestData map[string]interface{}
	buf := new(bytes.Buffer)
	buf.ReadFrom(resp.Body)
	respBytes := buf.Bytes()
	json.Unmarshal(respBytes, &requestData)

	session.Values["id"] = requestData["id"].(string)
	session.Values["isVerified"] = requestData["isVerified"].(string)
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

	m := map[string]string{
		"path":      req.URL.Path,
		"signature": req.FormValue("signature"),
	}
	jsonData, _ := json.Marshal(m)
	body := bytes.NewReader(jsonData)
	r, _ := http.NewRequest("POST", "http://localhost:3000/user/"+id+"/sign/verify", body)
	requestData, _ := sendRequest(r)

	session.Values["id"] = requestData["id"].(string)
	session.Values["isVerified"] = requestData["isVerified"].(string)
	session.Save(req, w)
	http.Redirect(w, req, "/account", http.StatusFound)

}
