package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/gorilla/sessions"
	"log"
	"net/http"
)

func CreateUser(w http.ResponseWriter, req *http.Request, session *sessions.Session) {
	req.ParseForm()
	log.Print(req.PostForm)
	log.Print(req.FormValue("password"))
	data := map[string]string{
		"email":    req.FormValue("email"),
		"password": req.FormValue("password"),
	}
	b, _ := json.Marshal(data)
	body := bytes.NewReader(b)
	client := &http.Client{}
	r, _ := http.NewRequest("POST", "http://localhost:3000/user", body)
	resp, err := client.Do(r)
	if err != nil {
		fmt.Printf("Error : %s", err)
	}
	if resp.StatusCode == http.StatusConflict {
		http.Error(w, "email is already registered", http.StatusConflict)
		return
	}

	var requestData map[string]interface{}
	buf := new(bytes.Buffer)
	buf.ReadFrom(resp.Body)
	respBytes := buf.Bytes()
	json.Unmarshal(respBytes, &requestData)

	session.Values["id"] = requestData["id"].(string)
	session.Save(req, w)

	http.Redirect(w, req, "/home/freelancer", http.StatusFound)
}
