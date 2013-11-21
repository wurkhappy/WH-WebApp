package handlers

import (
	"bytes"
	"encoding/json"
	"github.com/gorilla/mux"
	"github.com/gorilla/sessions"
	"github.com/wurkhappy/WH-Config"
	"html/template"
	"net/http"
	"time"
)

// var agreementTemplates = template.Must(template.ParseFiles("templates/agreements.html", "templates/createAgreements.html"))

func GetHome(w http.ResponseWriter, req *http.Request, session *sessions.Session) {
	userID := session.Values["id"]

	agreementsData := getCurrentAgreements(userID.(string))

	requestedUsers := getOtherUsers(agreementsData, userID.(string))

	thisUser := getUserInfo(userID.(string))

	m := map[string]interface{}{
		"appName":        "mainhome",
		"agreements":     agreementsData,
		"otherUsers":     requestedUsers,
		"thisUser":       thisUser,
		"agreementCount": len(agreementsData),
		"production":     Production,
	}
	format := func(date string) string {
		t, _ := time.Parse(time.RFC3339, date)
		return t.Format("Jan 2, 2006")
	}
	var tpl *template.Template
	var err error
	if len(agreementsData) > 0 {
		tpl, err = template.New("_baseApp.html").Funcs(template.FuncMap{"format": format}).ParseFiles(
			"templates/_baseApp.html",
			"templates/home.html",
		)
	} else {
		tpl, err = template.New("_baseApp.html").Funcs(template.FuncMap{"format": format}).ParseFiles(
			"templates/_baseApp.html",
			"templates/empty_home.html",
		)
	}

	template.Must(tpl, err)

	tpl.Execute(w, m)
}

func getCurrentAgreements(userID string) []map[string]interface{} {
	resp, statusCode := sendServiceRequest("GET", config.AgreementsService, "/user/"+userID+"/agreements", nil)
	if statusCode >= 400 {
		return nil
	}

	var agreementsData []map[string]interface{}
	json.Unmarshal(resp, &agreementsData)
	return agreementsData
}

func getOtherUsers(agreements []map[string]interface{}, userID string) []map[string]interface{} {
	requestString := buildOtherUsersRequest(agreements, userID)

	resp, statusCode := sendServiceRequest("GET", config.UserService, "/user/search?"+requestString, nil)
	if statusCode >= 400 {
		return nil
	}

	var users []map[string]interface{}
	json.Unmarshal(resp, &users)
	return users
}

func buildOtherUsersRequest(agreements []map[string]interface{}, userID string) string {
	var requestedUsers string
	for _, agreement := range agreements {
		clientID, _ := agreement["clientID"]
		// freelancerID, _ := agreement["freelancerID"]
		if draft, ok := agreement["draft"]; ok && !draft.(bool) {
			if clientID != "" && clientID != userID {
				requestedUsers += "userid=" + clientID.(string) + "&"
			}
		}
	}

	return requestedUsers
}

func PostFreelanceAgrmt(w http.ResponseWriter, req *http.Request, session *sessions.Session) {
	buf := new(bytes.Buffer)
	buf.ReadFrom(req.Body)
	resp, statusCode := sendServiceRequest("POST", config.AgreementsService, "/agreements/v", buf.Bytes())
	if statusCode >= 400 {
		var rError *responseError
		json.Unmarshal(resp, &rError)
		http.Error(w, rError.Description, statusCode)
		return
	}

	w.Write(resp)
}

func PutFreelanceAgrmt(w http.ResponseWriter, req *http.Request, session *sessions.Session) {
	vars := mux.Vars(req)

	buf := new(bytes.Buffer)
	buf.ReadFrom(req.Body)
	resp, statusCode := sendServiceRequest("PUT", config.AgreementsService, "/agreements/v/"+vars["versionID"], buf.Bytes())
	if statusCode >= 400 {
		var rError *responseError
		json.Unmarshal(resp, &rError)
		http.Error(w, rError.Description, statusCode)
		return
	}

	w.Write(resp)
}

func GetCreateAgreement(w http.ResponseWriter, req *http.Request, session *sessions.Session) {
	m := map[string]interface{}{
		"appName":    "maincreateagreement",
		"production": Production,
		"user": struct {
			ID string `json:"id"`
		}{
			session.Values["id"].(string),
		},
	}
	var index = template.Must(template.ParseFiles(
		"templates/_baseApp.html",
		"templates/create_agreement.html",
	))
	index.Execute(w, m)

}

func DeleteAgreement(w http.ResponseWriter, req *http.Request, session *sessions.Session) {
	vars := mux.Vars(req)

	resp, statusCode := sendServiceRequest("DELETE", config.AgreementsService, "/agreements/v/"+vars["versionID"], nil)
	if statusCode >= 400 {
		var rError *responseError
		json.Unmarshal(resp, &rError)
		http.Error(w, rError.Description, statusCode)
		return
	}
	w.Write([]byte(`{}`))
}
func GetAgreementDetails(w http.ResponseWriter, req *http.Request, session *sessions.Session) {

	userID := session.Values["id"]

	vars := mux.Vars(req)
	id := vars["versionID"]
	resp, statusCode := sendServiceRequest("GET", config.AgreementsService, "/agreements/v/"+id, nil)
	if statusCode >= 400 {
		var rError *responseError
		json.Unmarshal(resp, &rError)
		http.Error(w, rError.Description, statusCode)
		return
	}
	var agrmntData map[string]interface{}
	json.Unmarshal(resp, &agrmntData)

	resp, statusCode = sendServiceRequest("GET", config.CommentsService, "/agreement/"+agrmntData["agreementID"].(string)+"/comments", nil)
	if statusCode >= 400 {
		var rError *responseError
		json.Unmarshal(resp, &rError)
		http.Error(w, rError.Description, statusCode)
		return
	}
	var commentsData []map[string]interface{}
	json.Unmarshal(resp, &commentsData)

	otherID, _ := agrmntData["freelancerID"]
	if otherID == userID {
		otherID = agrmntData["clientID"]
	}
	var otherUser map[string]interface{}
	if otherID != "" {
		otherUser = getUserInfo(otherID.(string))
	}
	thisUser := getUserInfo(userID.(string))

	m := map[string]interface{}{
		"appName":    "mainagreement",
		"agreement":  agrmntData,
		"otherUser":  otherUser,
		"thisUser":   thisUser,
		"comments":   commentsData,
		"production": Production,
	}

	format := func(date string) string {
		t, _ := time.Parse(time.RFC3339, date)
		return t.Format("Jan 2, 2006")
	}

	tpl, err := template.New("_baseApp.html").Funcs(template.FuncMap{"format": format}).ParseFiles(
		"templates/_baseApp.html",
		"templates/freelancer_perspective_agreement.html",
	)
	template.Must(tpl, err)

	tpl.Execute(w, m)
}

func CreateAgreementStatus(w http.ResponseWriter, req *http.Request, session *sessions.Session) {
	vars := mux.Vars(req)
	id := vars["versionID"]
	buf := new(bytes.Buffer)
	buf.ReadFrom(req.Body)
	reqBytes := buf.Bytes()
	var status *Status
	json.Unmarshal(reqBytes, &status)

	status.AgreementID = id
	status.UserID = session.Values["id"].(string)
	data, _ := json.Marshal(status)

	resp, statusCode := sendServiceRequest("POST", config.AgreementsService, "/agreement/v/"+id+"/status", data)
	if statusCode >= 400 {
		var rError *responseError
		json.Unmarshal(resp, &rError)
		http.Error(w, rError.Description, statusCode)
		return
	}
	w.Write(resp)
}

func CreatePaymentStatus(w http.ResponseWriter, req *http.Request, session *sessions.Session) {
	vars := mux.Vars(req)
	id := vars["versionID"]
	paymentID := vars["paymentID"]

	buf := new(bytes.Buffer)
	buf.ReadFrom(req.Body)
	reqBytes := buf.Bytes()
	var status *Status
	json.Unmarshal(reqBytes, &status)

	status.AgreementID = id
	status.PaymentID = paymentID
	status.UserID = session.Values["id"].(string)
	data, _ := json.Marshal(status)

	resp, statusCode := sendServiceRequest("POST", config.AgreementsService, "/agreement/v/"+id+"/payment/"+paymentID+"/status", data)
	if statusCode >= 400 {
		var rError *responseError
		json.Unmarshal(resp, &rError)
		http.Error(w, rError.Description, statusCode)
		return
	}
	w.Write(resp)
}

func CreateComment(w http.ResponseWriter, req *http.Request, session *sessions.Session) {
	vars := mux.Vars(req)
	id := vars["agreementID"]

	buf := new(bytes.Buffer)
	buf.ReadFrom(req.Body)
	resp, statusCode := sendServiceRequest("POST", config.CommentsService, "/agreement/"+id+"/comments", buf.Bytes())
	if statusCode >= 400 {
		var rError *responseError
		json.Unmarshal(resp, &rError)
		http.Error(w, rError.Description, statusCode)
		return
	}
	w.Write(resp)
}

func ArchiveAgreement(w http.ResponseWriter, req *http.Request, session *sessions.Session) {
	vars := mux.Vars(req)

	buf := new(bytes.Buffer)
	buf.ReadFrom(req.Body)
	resp, statusCode := sendServiceRequest("POST", config.AgreementsService, "/agreements/v/"+vars["versionID"]+"/archive", buf.Bytes())
	if statusCode >= 400 {
		var rError *responseError
		json.Unmarshal(resp, &rError)
		http.Error(w, rError.Description, statusCode)
		return
	}

	w.Write(resp)
}

func ShowSample(w http.ResponseWriter, req *http.Request, session *sessions.Session) {
	m := map[string]interface{}{
		"production": Production,
	}
	var index = template.Must(template.ParseFiles(
		"templates/_baseApp.html",
		"templates/sample_agreement.html",
	))
	index.Execute(w, m)
}
