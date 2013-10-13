package handlers

import (
	"bytes"
	//"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	"github.com/gorilla/sessions"
	"html/template"
	"log"
	"net/http"
)

func GetAccount(w http.ResponseWriter, req *http.Request, session *sessions.Session) {
	userID := session.Values["id"]

	user := getUserInfo(userID.(string))

	m := map[string]interface{}{
		"appName": "mainaccount",
		"user":    user,
	}
	var index = template.Must(template.ParseFiles(
		"templates/_baseApp.html",
		"templates/account.html",
	))
	index.Execute(w, m)
}

func SaveCard(w http.ResponseWriter, req *http.Request, session *sessions.Session) {

	vars := mux.Vars(req)
	id := vars["id"]

	client := &http.Client{}
	buf := new(bytes.Buffer)
	buf.ReadFrom(req.Body)
	jsonData := buf.Bytes()
	body := bytes.NewReader(jsonData)
	r, _ := http.NewRequest("POST", "http://localhost:3120/user/"+id+"/cards", body)
	resp, err := client.Do(r)
	if err != nil {
		fmt.Printf("Error : %s", err)
	}

	buf = new(bytes.Buffer)
	buf.ReadFrom(resp.Body)
	w.Write(buf.Bytes())
}
