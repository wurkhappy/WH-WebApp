package handlers

import (
	"bytes"
	"encoding/json"
	"github.com/gorilla/mux"
	"github.com/gorilla/sessions"
	"github.com/wurkhappy/WH-Config"
	"net/http"
)

func CreatePayments(w http.ResponseWriter, req *http.Request, session *sessions.Session) {
	vars := mux.Vars(req)

	var userID string
	if uID, ok := session.Values["id"]; ok {
		userID = uID.(string)
	}

	buf := new(bytes.Buffer)
	buf.ReadFrom(req.Body)
	resp, statusCode := sendServiceRequest("POST", config.PaymentsService, "/agreements/v/"+vars["versionID"]+"/payments", buf.Bytes(), userID)
	if statusCode >= 400 {
		var rError *responseError
		json.Unmarshal(resp, &rError)
		http.Error(w, rError.Description, statusCode)
		return
	}

	w.Write(resp)
}

func CreatePaymentAction(w http.ResponseWriter, req *http.Request, session *sessions.Session) {
	vars := mux.Vars(req)
	paymentID := vars["paymentID"]

	buf := new(bytes.Buffer)
	buf.ReadFrom(req.Body)

	resp, statusCode := sendServiceRequest("POST", config.PaymentsService, "/payments/"+paymentID+"/action", buf.Bytes(), session.Values["id"].(string))
	if statusCode >= 400 {
		var rError *responseError
		json.Unmarshal(resp, &rError)
		http.Error(w, rError.Description, statusCode)
		return
	}
	w.Write(resp)
}

func UpdatePayment(w http.ResponseWriter, req *http.Request, session *sessions.Session) {
	vars := mux.Vars(req)
	paymentID := vars["paymentID"]

	buf := new(bytes.Buffer)
	buf.ReadFrom(req.Body)
	resp, statusCode := sendServiceRequest("PUT", config.PaymentsService, "/payments/"+paymentID, buf.Bytes(), session.Values["id"].(string))
	if statusCode >= 400 {
		var rError *responseError
		json.Unmarshal(resp, &rError)
		http.Error(w, rError.Description, statusCode)
		return
	}
	w.Write(resp)
}
