package handlers

import (
	"bytes"
	"encoding/json"
	"github.com/gorilla/mux"
	"github.com/gorilla/sessions"
	"github.com/wurkhappy/WH-Config"
	"html/template"
	"net/http"
)

func GetAccount(w http.ResponseWriter, req *http.Request, session *sessions.Session) {
	userID := session.Values["id"].(string)

	resp, statusCode := sendServiceRequest("GET", config.UserService, "/user/"+userID+"/details", nil, userID)
	if statusCode >= 400 {
		var rError *responseError
		json.Unmarshal(resp, &rError)
		http.Error(w, rError.Description, statusCode)
		return
	}
	var user map[string]interface{}
	json.Unmarshal(resp, &user)

	m := map[string]interface{}{
		"appName":    "mainaccount",
		"user":       user,
		"production": Production,
		"JSversion":  JSversion,
		"CSSversion": CSSversion,
		"returnURL":  CSSversion,
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

	buf := new(bytes.Buffer)
	buf.ReadFrom(req.Body)
	resp, statusCode := sendServiceRequest("POST", config.PaymentInfoService, "/user/"+id+"/cards", buf.Bytes(), session.Values["id"].(string))
	if statusCode >= 400 {
		var rError *responseError
		json.Unmarshal(resp, &rError)
		http.Error(w, rError.Description, statusCode)
		return
	}

	w.Write(resp)
}

func DeleteCard(w http.ResponseWriter, req *http.Request, session *sessions.Session) {

	vars := mux.Vars(req)
	id := vars["id"]
	cardID := vars["cardID"]

	resp, statusCode := sendServiceRequest("DELETE", config.PaymentInfoService, "/user/"+id+"/cards/"+cardID, nil, session.Values["id"].(string))
	if statusCode >= 400 {
		var rError *responseError
		json.Unmarshal(resp, &rError)
		http.Error(w, rError.Description, statusCode)
		return
	}

}

func GetCards(w http.ResponseWriter, req *http.Request, session *sessions.Session) {
	vars := mux.Vars(req)
	id := vars["id"]

	resp, statusCode := sendServiceRequest("GET", config.PaymentInfoService, "/user/"+id+"/cards", nil, session.Values["id"].(string))
	if statusCode >= 400 {
		var rError *responseError
		json.Unmarshal(resp, &rError)
		http.Error(w, rError.Description, statusCode)
		return
	}

	w.Write(resp)
}

func GetBankAccounts(w http.ResponseWriter, req *http.Request, session *sessions.Session) {
	vars := mux.Vars(req)
	id := vars["id"]

	resp, statusCode := sendServiceRequest("GET", config.PaymentInfoService, "/user/"+id+"/bank_account", nil, session.Values["id"].(string))
	if statusCode >= 400 {
		var rError *responseError
		json.Unmarshal(resp, &rError)
		http.Error(w, rError.Description, statusCode)
		return
	}

	w.Write(resp)
}

func SaveBankAccount(w http.ResponseWriter, req *http.Request, session *sessions.Session) {
	vars := mux.Vars(req)
	id := vars["id"]

	buf := new(bytes.Buffer)
	buf.ReadFrom(req.Body)
	resp, statusCode := sendServiceRequestWithTimeout("POST", config.PaymentInfoService, "/user/"+id+"/bank_account", buf.Bytes(), 10000, session.Values["id"].(string))
	if statusCode >= 400 {
		var rError *responseError
		json.Unmarshal(resp, &rError)
		http.Error(w, rError.Description, statusCode)
		return
	}

	w.Write(resp)
}

func DeleteBankAccount(w http.ResponseWriter, req *http.Request, session *sessions.Session) {

	vars := mux.Vars(req)
	id := vars["id"]
	accountID := vars["accountID"]

	resp, statusCode := sendServiceRequest("DELETE", config.PaymentInfoService, "/user/"+id+"/bank_account/"+accountID, nil, session.Values["id"].(string))
	if statusCode >= 400 {
		var rError *responseError
		json.Unmarshal(resp, &rError)
		http.Error(w, rError.Description, statusCode)
		return
	}
}

func VerifyBankAccount(w http.ResponseWriter, req *http.Request, session *sessions.Session) {
	vars := mux.Vars(req)
	id := vars["id"]
	accountID := vars["accountID"]

	buf := new(bytes.Buffer)
	buf.ReadFrom(req.Body)
	resp, statusCode := sendServiceRequestWithTimeout("POST", config.PaymentInfoService, "/user/"+id+"/bank_account/"+accountID+"/verify", buf.Bytes(), 10000, session.Values["id"].(string))
	if statusCode >= 400 {
		var rError *responseError
		json.Unmarshal(resp, &rError)
		http.Error(w, rError.Description, statusCode)
		return
	}

	w.Write([]byte(`{}`))
}
