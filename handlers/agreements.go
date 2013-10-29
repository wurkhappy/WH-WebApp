package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	"github.com/gorilla/sessions"
	"html/template"
	"log"
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
	}
	format := func(date string) string {
		t, _ := time.Parse(time.RFC3339, date)
		return t.Format("Jan 2, 2006")
	}

	tpl, err := template.New("_baseApp.html").Funcs(template.FuncMap{"format": format}).ParseFiles(
		"templates/_baseApp.html",
		"templates/freelancer_home.html",
	)
	template.Must(tpl, err)

	tpl.Execute(w, m)
}

func getCurrentAgreements(userID string) []map[string]interface{} {
	client := &http.Client{}
	r, _ := http.NewRequest("GET", AgreementsService + "/agreements?userID="+userID, nil)
	resp, err := client.Do(r)
	if err != nil {
		fmt.Printf("Error : %s", err)
	}

	buf := new(bytes.Buffer)
	buf.ReadFrom(resp.Body)
	var agreementsData []map[string]interface{}
	json.Unmarshal(buf.Bytes(), &agreementsData)
	return agreementsData
}

func getOtherUsers(agreements []map[string]interface{}, userID string) []map[string]interface{} {
	requestString := buildOtherUsersRequest(agreements, userID)
	client := &http.Client{}
	r, _ := http.NewRequest("GET", UserService + "/user/search?"+requestString, nil)
	resp, err := client.Do(r)
	if err != nil {
		fmt.Printf("Error : %s", err)
	}
	usersBuf := new(bytes.Buffer)
	usersBuf.ReadFrom(resp.Body)
	var users []map[string]interface{}
	json.Unmarshal(usersBuf.Bytes(), &users)
	return users
}

func buildOtherUsersRequest(agreements []map[string]interface{}, userID string) string {
	var requestedUsers string
	for _, agreement := range agreements {
		clientID, _ := agreement["clientID"]
		freelancerID, _ := agreement["freelancerID"]
		if draft, ok := agreement["draft"]; ok && !draft.(bool) {
			if clientID != "" && clientID != userID {
				requestedUsers += "userid=" + clientID.(string) + "&"
			} else {
				requestedUsers += "userid=" + freelancerID.(string) + "&"

			}
		}
	}

	return requestedUsers
}

func PostFreelanceAgrmt(w http.ResponseWriter, req *http.Request, session *sessions.Session) {

	client := &http.Client{}
	r, _ := http.NewRequest("POST", AgreementsService + "/agreements/v", req.Body)
	resp, err := client.Do(r)
	if err != nil {
		fmt.Printf("Error : %s", err)
	}

	buf := new(bytes.Buffer)
	buf.ReadFrom(resp.Body)
	buf.String()
	w.Write(buf.Bytes())
}

func PutFreelanceAgrmt(w http.ResponseWriter, req *http.Request, session *sessions.Session) {
	vars := mux.Vars(req)

	client := &http.Client{}
	r, _ := http.NewRequest("PUT", AgreementsService + "/agreements/v/"+vars["id"], req.Body)
	resp, err := client.Do(r)
	if err != nil {
		fmt.Printf("Error : %s", err)
	}

	buf := new(bytes.Buffer)
	buf.ReadFrom(resp.Body)
	w.Write(buf.Bytes())
}

func GetCreateAgreement(w http.ResponseWriter, req *http.Request, session *sessions.Session) {
	m := map[string]interface{}{
		"appName": "maincreateagreement",
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
	client := &http.Client{}

	r, _ := http.NewRequest("DELETE", AgreementsService + "/agreements/v/"+vars["id"], nil)
	_, err := client.Do(r)
	if err != nil {
		fmt.Printf("Error : %s", err)
	}
	w.Write([]byte(`{}`))
}
func GetAgreementDetails(w http.ResponseWriter, req *http.Request, session *sessions.Session) {

	userID := session.Values["id"]

	vars := mux.Vars(req)
	id := vars["id"]
	agrmntReq, _ := http.NewRequest("GET", AgreementsService + "/agreements/v/"+id, nil)
	agrmntData, _ := sendRequest(agrmntReq)
	log.Print(agrmntData)

	commentReq, _ := http.NewRequest("GET", CommentsService + "/agreement/"+agrmntData["agreementID"].(string)+"/comments", nil)
	commentsData, _ := sendRequestArray(commentReq)

	r, _ := http.NewRequest("GET", PaymentInfoService + "/user/"+userID.(string)+"/cards", nil)
	cards, _ := sendRequestArray(r)

	fmt.Println(cards)

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
		"appName":   "mainagreement",
		"agreement": agrmntData,
		"otherUser": otherUser,
		"thisUser":  thisUser,
		"comments":  commentsData,
		"cards":     cards,
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
	body := bytes.NewReader(data)

	r, _ := http.NewRequest("POST", AgreementsService + "/agreement/v/"+id+"/status", body)
	_, respBytes := sendRequest(r)
	w.Write(respBytes)
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
	body := bytes.NewReader(data)

	r, _ := http.NewRequest("POST", AgreementsService + "/agreement/v/"+id+"/payment/"+paymentID+"/status", body)
	_, respBytes := sendRequest(r)
	w.Write(respBytes)
}

func CreateComment(w http.ResponseWriter, req *http.Request, session *sessions.Session) {
	vars := mux.Vars(req)
	id := vars["agreementID"]
	r, _ := http.NewRequest("POST", CommentsService + "/agreement/"+id+"/comments", req.Body)
	_, respBytes := sendRequest(r)
	w.Write(respBytes)
}
