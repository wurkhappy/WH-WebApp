package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	"github.com/gorilla/sessions"
	"github.com/wurkhappy/WH-Config"
	"html/template"
	"net/http"
	"sync"
	"time"
)

var homeTpl *template.Template
var emptyHomeTpl *template.Template
var archivesTpl *template.Template
var emptyArchivesTpl *template.Template

func init() {
	format := func(date string) string {
		t, _ := time.Parse(time.RFC3339, date)
		return t.Format("Jan 2, 2006")
	}

	homeTpl, _ = template.New("_baseApp.html").Funcs(template.FuncMap{"format": format}).ParseFiles(
		"templates/_baseApp.html",
		"templates/home.html",
	)

	emptyHomeTpl, _ = template.New("_baseApp.html").Funcs(template.FuncMap{"format": format}).ParseFiles(
		"templates/_baseApp.html",
		"templates/empty_home.html",
	)

	archivesTpl, _ = template.New("_baseApp.html").Funcs(template.FuncMap{"format": format}).ParseFiles(
		"templates/_baseApp.html",
		"templates/archives.html",
	)
	emptyArchivesTpl, _ = template.New("_baseApp.html").Funcs(template.FuncMap{"format": format}).ParseFiles(
		"templates/_baseApp.html",
		"templates/empty_archives.html",
	)
}

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
		"JSversion":      JSversion,
		"CSSversion":     CSSversion,
	}

	var tpl *template.Template
	if len(agreementsData) > 0 {
		tpl = homeTpl
	} else {
		tpl = emptyHomeTpl
	}

	tpl.Execute(w, m)
}

func GetArchives(w http.ResponseWriter, req *http.Request, session *sessions.Session) {
	userID := session.Values["id"]

	agreementsData := getArchivedAgreements(userID.(string))

	requestedUsers := getOtherUsers(agreementsData, userID.(string))

	thisUser := getUserInfo(userID.(string))

	m := map[string]interface{}{
		"appName":        "mainarchives",
		"agreements":     agreementsData,
		"otherUsers":     requestedUsers,
		"thisUser":       thisUser,
		"agreementCount": len(agreementsData),
		"production":     Production,
		"JSversion":      JSversion,
		"CSSversion":     CSSversion,
	}
	if len(agreementsData) == 0 {
		emptyArchivesTpl.Execute(w, m)
		return
	}

	archivesTpl.Execute(w, m)
}

func getCurrentAgreements(userID string) []map[string]interface{} {
	resp, statusCode := sendServiceRequest("GET", config.AgreementsService, "/user/"+userID+"/agreements", nil, userID)
	if statusCode >= 400 {
		return nil
	}

	var agreementsData []map[string]interface{}
	json.Unmarshal(resp, &agreementsData)
	return agreementsData
}

func getArchivedAgreements(userID string) []map[string]interface{} {
	resp, statusCode := sendServiceRequest("GET", config.AgreementsService, "/user/"+userID+"/archives", nil, userID)
	if statusCode >= 400 {
		return nil
	}

	var agreementsData []map[string]interface{}
	json.Unmarshal(resp, &agreementsData)
	return agreementsData
}

func getOtherUsers(agreements []map[string]interface{}, userID string) []map[string]interface{} {
	requestString := buildOtherUsersRequest(agreements, userID)

	resp, statusCode := sendServiceRequest("GET", config.UserService, "/users?"+requestString, nil, userID)
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
		freelancerID, _ := agreement["freelancerID"]
		if draft, ok := agreement["draft"]; ok && !draft.(bool) {
			if clientID != "" && clientID != userID {
				requestedUsers += "userid=" + clientID.(string) + "&"
			} else if freelancerID != "" && freelancerID != userID {
				requestedUsers += "userid=" + freelancerID.(string) + "&"
			}
		}
	}

	return requestedUsers
}

func PostFreelanceAgrmt(w http.ResponseWriter, req *http.Request, session *sessions.Session) {
	buf := new(bytes.Buffer)
	buf.ReadFrom(req.Body)
	resp, statusCode := sendServiceRequest("POST", config.AgreementsService, "/agreements/v", buf.Bytes(), session.Values["id"].(string))
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

	var agreement []byte = buf.Bytes()

	var data map[string]interface{}
	json.Unmarshal(agreement, &data)

	if email, ok := data["clientEmail"]; ok {
		resp, statusCode := sendServiceRequest("GET", config.UserService, "/users?create=true&email="+email.(string), nil, session.Values["id"].(string))
		if statusCode >= 400 {
			var rError *responseError
			json.Unmarshal(resp, &rError)
			http.Error(w, rError.Description, statusCode)
			return
		}
		fmt.Println(string(resp))

		var users []map[string]interface{}
		json.Unmarshal(resp, &users)

		if data["freelancerID"].(string) != "" {
			data["clientID"] = users[0]["id"].(string)
		} else {
			data["freelancerID"] = users[0]["id"].(string)
		}

		agreement, _ = json.Marshal(data)
	}

	resp, statusCode := sendServiceRequest("PUT", config.AgreementsService, "/agreements/v/"+vars["versionID"], agreement, session.Values["id"].(string))
	if statusCode >= 400 {
		var rError *responseError
		json.Unmarshal(resp, &rError)
		http.Error(w, rError.Description, statusCode)
		return
	}

	w.Write(resp)
}

func GetCreateAgreement(w http.ResponseWriter, req *http.Request, session *sessions.Session) {
	var agrmntData map[string]interface{}
	var otherUser map[string]interface{}
	if id := req.URL.Query().Get("versionID"); id != "" {
		resp, statusCode := sendServiceRequest("GET", config.AgreementsService, "/agreements/v/"+id, nil, session.Values["id"].(string))
		if statusCode >= 400 {
			var rError *responseError
			json.Unmarshal(resp, &rError)
			http.Error(w, rError.Description, statusCode)
			return
		}
		json.Unmarshal(resp, &agrmntData)

		var userID string
		if session.Values["id"] == agrmntData["freelancerID"].(string) {
			userID = agrmntData["clientID"].(string)
		} else {
			userID = agrmntData["freelancerID"].(string)
		}
		if userID != "" {
			otherUser = getUserInfo(userID)
		}
	}

	userResp, userStatusCode := sendServiceRequest("GET", config.UserService, "/user/"+session.Values["id"].(string)+"/details", nil, session.Values["id"].(string))
	if userStatusCode >= 400 {
		var rError *responseError
		json.Unmarshal(userResp, &rError)
		http.Error(w, rError.Description, userStatusCode)
		return
	}
	var user map[string]interface{}
	json.Unmarshal(userResp, &user)

	m := map[string]interface{}{
		"appName":    "maincreateagreement",
		"production": Production,
		"JSversion":  JSversion,
		"CSSversion": CSSversion,
		"agreement":  agrmntData,
		"otherUser":  otherUser,
		"user":       user,
	}
	var index = template.Must(template.ParseFiles(
		"templates/_baseApp.html",
		"templates/create_agreement.html",
	))
	index.Execute(w, m)

}

func DeleteAgreement(w http.ResponseWriter, req *http.Request, session *sessions.Session) {
	vars := mux.Vars(req)

	resp, statusCode := sendServiceRequest("DELETE", config.AgreementsService, "/agreements/v/"+vars["versionID"], nil, session.Values["id"].(string))
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
	var agrmntData map[string]interface{}
	var paymentsData []map[string]interface{}
	var tasksData []map[string]interface{}

	var wg sync.WaitGroup
	wg.Add(3)
	go func() {
		resp, statusCode := sendServiceRequest("GET", config.AgreementsService, "/agreements/v/"+id, nil, session.Values["id"].(string))
		if statusCode >= 400 {
			var rError *responseError
			json.Unmarshal(resp, &rError)
			http.Error(w, rError.Description, statusCode)
			return
		}
		json.Unmarshal(resp, &agrmntData)
		wg.Done()
	}()
	go func() {
		resp, statusCode := sendServiceRequest("GET", config.PaymentsService, "/agreements/v/"+id+"/payments", nil, session.Values["id"].(string))
		if statusCode >= 400 {
			var rError *responseError
			json.Unmarshal(resp, &rError)
			http.Error(w, rError.Description, statusCode)
			return
		}
		json.Unmarshal(resp, &paymentsData)
		wg.Done()
	}()
	go func() {
		resp, statusCode := sendServiceRequest("GET", config.TasksService, "/agreements/v/"+id+"/tasks", nil, session.Values["id"].(string))
		if statusCode >= 400 {
			var rError *responseError
			json.Unmarshal(resp, &rError)
			http.Error(w, rError.Description, statusCode)
			return
		}
		json.Unmarshal(resp, &tasksData)
		wg.Done()
	}()
	wg.Wait()

	otherid, _ := agrmntData["freelancerID"]
	otherID := otherid.(string)
	if otherID == userID {
		otherID = agrmntData["clientID"].(string)
	}
	var otherUser map[string]interface{}
	if otherID != "" {
		otherUser = getUserInfo(otherID)
	}
	thisUser := getUserInfo(userID.(string))

	m := map[string]interface{}{
		"appName":    "mainagreement",
		"agreement":  agrmntData,
		"payments":   paymentsData,
		"tasks":      tasksData,
		"otherUser":  otherUser,
		"thisUser":   thisUser,
		"production": Production,
		"JSversion":  JSversion,
		"CSSversion": CSSversion,
	}

	format := func(date string) string {
		t, _ := time.Parse(time.RFC3339, date)
		return t.Format("Jan 2, 2006")
	}

	tpl, err := template.New("_baseApp.html").Funcs(template.FuncMap{"format": format, "unescape": unescaped}).ParseFiles(
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

	resp, statusCode := sendServiceRequest("POST", config.AgreementsService, "/agreements/v/"+id+"/action", buf.Bytes(), session.Values["id"].(string))
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
	resp, statusCode := sendServiceRequest("POST", config.AgreementsService, "/agreements/v/"+vars["versionID"]+"/archive", buf.Bytes(), session.Values["id"].(string))
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
		"JSversion":  JSversion,
		"CSSversion": CSSversion,
	}
	var index = template.Must(template.ParseFiles(
		"templates/_baseApp.html",
		"templates/sample.html",
	))
	index.Execute(w, m)
}

