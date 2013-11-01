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
	r, _ := http.NewRequest("POST", PaymentInfoService+"/user/"+id+"/cards", body)
	resp, err := client.Do(r)
	if err != nil {
		fmt.Printf("Error : %s", err)
	}

	buf = new(bytes.Buffer)
	buf.ReadFrom(resp.Body)
	w.Write(buf.Bytes())
}

func DeleteCard(w http.ResponseWriter, req *http.Request, session *sessions.Session) {

	vars := mux.Vars(req)
	id := vars["id"]
	cardID := vars["cardID"]

	client := &http.Client{}
	r, _ := http.NewRequest("DELETE", PaymentInfoService+"/user/"+id+"/cards/"+cardID, nil)
	_, err := client.Do(r)
	if err != nil {
		fmt.Printf("Error : %s", err)
	}
}

func GetCards(w http.ResponseWriter, req *http.Request, session *sessions.Session) {
	vars := mux.Vars(req)
	id := vars["id"]

	client := &http.Client{}
	r, _ := http.NewRequest("GET", PaymentInfoService+"/user/"+id+"/cards", nil)
	resp, err := client.Do(r)
	if err != nil {
		fmt.Printf("Error : %s", err)
	}

	buf := new(bytes.Buffer)
	buf.ReadFrom(resp.Body)
	w.Write(buf.Bytes())
}

func GetBankAccounts(w http.ResponseWriter, req *http.Request, session *sessions.Session) {
	vars := mux.Vars(req)
	id := vars["id"]

	client := &http.Client{}
	r, _ := http.NewRequest("GET", PaymentInfoService+"/user/"+id+"/bank_account", nil)
	resp, err := client.Do(r)
	if err != nil {
		fmt.Printf("Error : %s", err)
	}

	buf := new(bytes.Buffer)
	buf.ReadFrom(resp.Body)
	w.Write(buf.Bytes())
}

func SaveBankAccount(w http.ResponseWriter, req *http.Request, session *sessions.Session) {
	vars := mux.Vars(req)
	id := vars["id"]

	client := &http.Client{}
	buf := new(bytes.Buffer)
	buf.ReadFrom(req.Body)
	jsonData := buf.Bytes()
	log.Print(buf.String())
	body := bytes.NewReader(jsonData)
	r, _ := http.NewRequest("POST", PaymentInfoService+"/user/"+id+"/bank_account", body)
	resp, err := client.Do(r)
	if err != nil {
		fmt.Printf("Error : %s", err)
	}

	buf = new(bytes.Buffer)
	buf.ReadFrom(resp.Body)
	w.Write(buf.Bytes())
}

func DeleteBankAccount(w http.ResponseWriter, req *http.Request, session *sessions.Session) {

	vars := mux.Vars(req)
	id := vars["id"]
	accountID := vars["accountID"]

	client := &http.Client{}
	r, _ := http.NewRequest("DELETE", PaymentInfoService+"/user/"+id+"/bank_account/"+accountID, nil)
	_, err := client.Do(r)
	if err != nil {
		fmt.Printf("Error : %s", err)
	}
}

func VerifyBankAccount(w http.ResponseWriter, req *http.Request, session *sessions.Session) {
	vars := mux.Vars(req)
	id := vars["id"]
	accountID := vars["accountID"]

	client := &http.Client{}
	r, _ := http.NewRequest("POST", PaymentInfoService+"/user/"+id+"/bank_account/"+accountID+"/verify", req.Body)
	resp, err := client.Do(r)
	if err != nil {
		fmt.Printf("Error : %s", err)
	}

	if resp.StatusCode >= 400 {
		http.Error(w, "Error verifying account", resp.StatusCode)
		return
	}

	w.Write([]byte(`{}`))
}
