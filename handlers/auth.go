package handlers

import (
	"bytes"
	"fmt"
	"github.com/gorilla/sessions"
	"html/template"
	"net/http"
)

var authTemplates = template.Must(template.ParseFiles("templates/login.html", "templates/newAccount.html"))

func PostLogin(w http.ResponseWriter, req *http.Request, session *sessions.Session) {

	client := &http.Client{}
	r, _ := http.NewRequest("POST", "http://localhost:3000/auth/login", req.Body)
	resp, err := client.Do(r)
	if err != nil {
		fmt.Printf("Error : %s", err)
	}

	buf := new(bytes.Buffer)
	buf.ReadFrom(resp.Body)
	w.Write(buf.Bytes())
}

func GetLogin(w http.ResponseWriter, req *http.Request) {

	err := authTemplates.ExecuteTemplate(w, "login.html", nil)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func GetCreateAccount(w http.ResponseWriter, req *http.Request) {
	err := authTemplates.ExecuteTemplate(w, "newAccount.html", nil)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
