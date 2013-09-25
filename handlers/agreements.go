package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	"github.com/gorilla/sessions"
	"html/template"
	"net/http"
)

// var agreementTemplates = template.Must(template.ParseFiles("templates/agreements.html", "templates/createAgreements.html"))

func GetFreelanceAgrmt(w http.ResponseWriter, req *http.Request, session *sessions.Session) {

	// client := &http.Client{}
	// r, _ := http.NewRequest("POST", "http://localhost:3000/auth/login", req.Body)
	// resp, err := client.Do(r)
	// if err != nil {
	// 	fmt.Printf("Error : %s", err)
	// }

	// buf := new(bytes.Buffer)
	// buf.ReadFrom(resp.Body)
	// w.Write(buf.Bytes())
	m := map[string]interface{}{
		"appName": "mainhome",
	}
	var index = template.Must(template.ParseFiles(
		"templates/_baseApp.html",
		"templates/freelancer_home.html",
	))
	index.Execute(w, m)
}

func PostFreelanceAgrmt(w http.ResponseWriter, req *http.Request, session *sessions.Session) {

	data := make(map[string]interface{})
	buf := new(bytes.Buffer)
	buf.ReadFrom(req.Body)
	reqBytes := buf.Bytes()
	json.Unmarshal(reqBytes, &data)

	data["freelancerID"] = session.Values["id"]

	b, _ := json.Marshal(data)
	body := bytes.NewReader(b)

	client := &http.Client{}
	r, _ := http.NewRequest("POST", "http://localhost:4050/agreements", body)
	resp, err := client.Do(r)
	if err != nil {
		fmt.Printf("Error : %s", err)
	}

	buf = new(bytes.Buffer)
	buf.ReadFrom(resp.Body)
	buf.String()
	w.Write(buf.Bytes())
}

func PutFreelanceAgrmt(w http.ResponseWriter, req *http.Request, session *sessions.Session) {
	vars := mux.Vars(req)

	client := &http.Client{}
	r, _ := http.NewRequest("PUT", "http://localhost:4050/agreements/"+vars["id"], req.Body)
	resp, err := client.Do(r)
	if err != nil {
		fmt.Printf("Error : %s", err)
	}

	buf := new(bytes.Buffer)
	buf.ReadFrom(resp.Body)
	buf.String()
	w.Write(buf.Bytes())
}

func GetCreateAgreement(w http.ResponseWriter, req *http.Request, session *sessions.Session) {

	m := map[string]interface{}{
		"appName": "maincreateagreement",
	}
	var index = template.Must(template.ParseFiles(
		"templates/_baseApp.html",
		"templates/create_agreement.html",
	))
	index.Execute(w, m)

}
