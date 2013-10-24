package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
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
	log.Print(buf.String())

	session.Values["id"] = requestData["id"].(string)
	session.Values["isVerified"] = requestData["isVerified"].(bool)
	session.Save(req, w)

	http.Redirect(w, req, "/home", http.StatusFound)
}

func UpdateUser(w http.ResponseWriter, req *http.Request, session *sessions.Session) {
	vars := mux.Vars(req)

	client := &http.Client{}
	r, _ := http.NewRequest("PUT", "http://localhost:3000/user/"+vars["id"], req.Body)
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

	buf := new(bytes.Buffer)
	buf.ReadFrom(resp.Body)
	buf.String()
	w.Write(buf.Bytes())
}
