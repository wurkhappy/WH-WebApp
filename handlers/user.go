package handlers

import (
	"bytes"
	"encoding/json"
	// "fmt"
	"github.com/gorilla/mux"
	"github.com/gorilla/sessions"
	"github.com/wurkhappy/WH-Config"
	"net/http"
)

func CreateUser(w http.ResponseWriter, req *http.Request, session *sessions.Session) {
	buf := new(bytes.Buffer)
	buf.ReadFrom(req.Body)
	resp, statusCode := sendServiceRequest("POST", config.UserService, "/user", buf.Bytes())
	if statusCode >= 400 {
		var rError *responseError
		json.Unmarshal(resp, &rError)
		http.Error(w, rError.Description, statusCode)
		return
	}

	var requestData map[string]interface{}
	json.Unmarshal(resp, &requestData)

	session.Values["id"] = requestData["id"].(string)
	session.Values["isVerified"] = requestData["isVerified"].(bool)
	session.Save(req, w)

	w.Write([]byte(`{"redirectURL":"/home"}`))
}

func UpdateUser(w http.ResponseWriter, req *http.Request, session *sessions.Session) {
	vars := mux.Vars(req)

	buf := new(bytes.Buffer)
	buf.ReadFrom(req.Body)
	resp, statusCode := sendServiceRequest("PUT", config.UserService, "/user/"+vars["id"], buf.Bytes())
	if statusCode >= 400 {
		var rError *responseError
		json.Unmarshal(resp, &rError)
		http.Error(w, rError.Description, rError.StatusCode)
		return
	}

	w.Write(resp)
}
