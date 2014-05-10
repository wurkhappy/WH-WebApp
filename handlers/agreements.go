package handlers

import (
	"bytes"
	"encoding/json"
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

	if userID == "" {
		http.Redirect(w, req, "/home/sample", http.StatusFound)
	}

	agreementsData := getCurrentAgreements(userID.(string))

	var agreementIDList string
	for _, agreement := range agreementsData {
		agreementIDList += "versionID=" + agreement["versionID"].(string) + "&"
	}

	var tasksData []map[string]interface{}
	resp, statusCode := sendServiceRequest("GET", config.TasksService, "/tasks?"+agreementIDList, nil, session.Values["id"].(string))
	if statusCode >= 400 {
		var rError *responseError
		json.Unmarshal(resp, &rError)
		http.Error(w, rError.Description, statusCode)
		return
	}
	json.Unmarshal(resp, &tasksData)

	requestedUsers := getOtherUsers(agreementsData, userID.(string))

	thisUser := getUserInfo(userID.(string))

	m := map[string]interface{}{
		"appName":        "mainhome",
		"agreements":     agreementsData,
		"tasks":          tasksData,
		"otherUsers":     requestedUsers,
		"thisUser":       thisUser,
		"agreementCount": len(agreementsData),
		"production":     Production,
		"JSversion":      JSversion,
		"CSSversion":     CSSversion,
	}

	var tpl *template.Template
	tpl = homeTpl
	if len(agreementsData) == 0 {
		tpl = emptyHomeTpl
	}

	tpl.Execute(w, m)
}

func GetHomeSample(w http.ResponseWriter, req *http.Request, session *sessions.Session) {
	var agreementsData []map[string]interface{}
	json.Unmarshal([]byte(`[{"acceptsBankTransfer":true,"acceptsCreditCard":true,"agreementID":"ed356d73-70b7-485c-7cac-c1e42b49ca86","archived":false,"clientID":"096d76ac-ac5c-489c-60ca-d0bde5aac605","freelancerID":"5275dc12-2429-42ad-536d-ccfdba2fc91c","lastAction":{"date":"2014-04-11T14:21:46.867388667-04:00","name":"accepted","userID":"5275dc12-2429-42ad-536d-ccfdba2fc91c"},"lastModified":"2014-04-11T14:21:46.867389586-04:00","lastSubAction":{"date":"2014-04-13T14:21:46.867388667-04:00","name":"accepted","userID":"5275dc12-2429-42ad-536d-ccfdba2fc91c", "type":"payment"},"proposedServices":"<p>Create a blog</p>\n","title":"Sample Agreement","version":1,"versionID":"../sample"}]`), &agreementsData)
	m := map[string]interface{}{
		"appName":    "mainhome",
		"agreements": agreementsData,
		// "otherUsers":     requestedUsers,
		// "thisUser":       thisUser,
		"agreementCount": len(agreementsData),
		"production":     Production,
		"JSversion":      JSversion,
		"CSSversion":     CSSversion,
	}

	var tpl *template.Template
	tpl = homeTpl
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
	var userID string
	if uID, ok := session.Values["id"]; ok {
		userID = uID.(string)
	}
	resp, statusCode := sendServiceRequest("POST", config.AgreementsService, "/agreements/v", buf.Bytes(), userID)
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
	var paymentsData []map[string]interface{}
	var tasksData []map[string]interface{}
	var otherUser map[string]interface{}
	if id := req.URL.Query().Get("versionID"); id != "" {
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

	var user map[string]interface{}

	if userID, ok := session.Values["id"]; ok {
		userResp, userStatusCode := sendServiceRequest("GET", config.UserService, "/user/"+userID.(string)+"/details", nil, userID.(string))
		if userStatusCode >= 400 {
			var rError *responseError
			json.Unmarshal(userResp, &rError)
			http.Error(w, rError.Description, userStatusCode)
			return
		}
		json.Unmarshal(userResp, &user)
	}

	m := map[string]interface{}{
		"appName":    "maincreateagreement",
		"production": Production,
		"JSversion":  JSversion,
		"CSSversion": CSSversion,
		"agreement":  agrmntData,
		"tasks":      tasksData,
		"payments":   paymentsData,
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
		"signedIn":   session.Values["signedIn"],
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

func AgreementReview(w http.ResponseWriter, req *http.Request, session *sessions.Session) {
	buf := new(bytes.Buffer)
	buf.ReadFrom(req.Body)

	var userID string
	if uID, ok := session.Values["id"]; ok {
		userID = uID.(string)
	}

	resp, statusCode := sendServiceRequest("GET", config.PDFTemplatesService, "/template/agreement", buf.Bytes(), userID)
	if statusCode >= 400 {
		var rError *responseError
		json.Unmarshal(resp, &rError)
		http.Error(w, rError.Description, statusCode)
		return
	}

	w.Write(resp)
}

func GetSample(w http.ResponseWriter, req *http.Request, session *sessions.Session) {

	var agrmntData map[string]interface{}
	json.Unmarshal([]byte(`{"acceptsBankTransfer":true,"acceptsCreditCard":true,"agreementID":"ed356d73-70b7-485c-7cac-c1e42b49ca86","archived":false,"clientID":"096d76ac-ac5c-489c-60ca-d0bde5aac605","freelancerID":"5275dc12-2429-42ad-536d-ccfdba2fc91c","lastAction":{"date":"2014-04-11T14:21:46.867388667-04:00","name":"accepted","userID":"5275dc12-2429-42ad-536d-ccfdba2fc91c"},"lastModified":"2014-04-11T14:21:46.867389586-04:00","lastSubAction":null,"proposedServices":"<p>Create a blog</p>\n","title":"Sample Agreement","version":1,"versionID":"ed356d73-70b7-485c-7cac-c1e42b49ca86"}`), &agrmntData)
	var paymentsData []map[string]interface{}
	json.Unmarshal([]byte(`[{"amountDue":1000,"amountPaid":1000,"dateExpected":"0001-01-01T00:00:00Z","id":"dd44897f-0760-41b9-4405-3fa1fa29c989","isDeposit":true,"lastAction":{"date":"2014-04-11T14:21:46.838297751-04:00","name":"accepted","userID":"5275dc12-2429-42ad-536d-ccfdba2fc91c"},"paymentItems":[{"amountDue":1000,"hours":0,"rate":0,"subtaskID":"","taskID":"","title":"Deposit"}],"title":"Deposit","versionID":"ed356d73-70b7-485c-7cac-c1e42b49ca86"},{"amountDue":2000,"amountPaid":0,"dateExpected":"2014-04-18T04:00:00Z","id":"c1ac7d37-91ee-46ee-6493-c6c00774a47b","isDeposit":false,"lastAction":null,"paymentItems":[],"title":"Halfway Payment","versionID":"ed356d73-70b7-485c-7cac-c1e42b49ca86"},{"amountDue":2000,"amountPaid":0,"dateExpected":"2014-04-25T04:00:00Z","id":"995b2162-5f51-416b-79c8-a0d85fb59da2","isDeposit":false,"lastAction":null,"paymentItems":[],"title":"Final Payment","versionID":"ed356d73-70b7-485c-7cac-c1e42b49ca86"}]`), &paymentsData)
	var tasksData []map[string]interface{}
	json.Unmarshal([]byte(`[{ "sample":true, "dateExpected": "2014-04-11T04:00:00Z", "hours": 0, "id": "77d3ea52-c969-4b98-42b7-c2938d616b36", "isPaid": false, "lastAction": { "name": "completed"}, "subTasks": [ { "dateExpected": "0001-01-01T00:00:00Z", "hours": 0, "id": "7da4396b-69b8-4505-56b3-b22aa34cf158", "isPaid": false, "lastAction": { "name": "completed"}, "subTasks": null, "title": "Ideation", "versionID": ""}, { "dateExpected": "0001-01-01T00:00:00Z", "hours": 0, "id": "e40c49a3-f4b1-4ca3-470a-8b80819bcdbc", "isPaid": false, "lastAction": { "name": "completed"}, "subTasks": null, "title": "Wireframes", "versionID": ""}, { "dateExpected": "0001-01-01T00:00:00Z", "hours": 0, "id": "6ceb4dd8-d586-4136-605d-a4e2b85ccb13", "isPaid": false, "lastAction": { "name": "completed"}, "subTasks": null, "title": "Review", "versionID": "" }], "title": "Design", "versionID": "ed356d73-70b7-485c-7cac-c1e42b49ca86"}, { "sample":true, "dateExpected": "2014-04-18T04:00:00Z", "hours": 0, "id": "98f79d60-8fe1-4f35-4f55-f6d0bf8caa47", "isPaid": false, "lastAction": null, "subTasks": [ { "dateExpected": "0001-01-01T00:00:00Z", "hours": 0, "id": "11a0bd22-4dd0-4ade-6dd4-54ba5ff49f99", "isPaid": false, "lastAction": null, "subTasks": null, "title": "Prototype in HTML/CSS", "versionID": ""}, { "dateExpected": "0001-01-01T00:00:00Z", "hours": 0, "id": "fe421c0d-80a9-4487-6158-cf35528ebb17", "isPaid": false, "lastAction": null, "subTasks": null, "title": "Review", "versionID": "" }], "title": "Mockup", "versionID": "ed356d73-70b7-485c-7cac-c1e42b49ca86"}, { "sample":true, "dateExpected": "2014-04-18T04:00:00Z", "hours": 0, "id": "0b47680f-40ca-483b-7803-4e5258bac5bf", "isPaid": false, "lastAction": null, "subTasks": [ { "dateExpected": "0001-01-01T00:00:00Z", "hours": 0, "id": "46786360-8c22-4f0d-7570-5e6042c5ae9f", "isPaid": false, "lastAction": null, "subTasks": null, "title": "Finish coding blog", "versionID": ""}, { "dateExpected": "0001-01-01T00:00:00Z", "hours": 0, "id": "18960288-3cc8-4855-4fb1-758da517c95c", "isPaid": false, "lastAction": null, "subTasks": null, "title": "Move to production", "versionID": ""}, { "dateExpected": "0001-01-01T00:00:00Z", "hours": 0, "id": "e5ebc27b-8a13-441a-7869-28e237f6ee62", "isPaid": false, "lastAction": null, "subTasks": null, "title": "Review", "versionID": "" }], "title": "Final Product", "versionID": "ed356d73-70b7-485c-7cac-c1e42b49ca86" }]`), &tasksData)
	var thisUser map[string]interface{}
	json.Unmarshal([]byte(`{"isRegistered":true, "firstName":"Matt", "lastName":"Parker"}`), &thisUser)
	var otherUser map[string]interface{}
	json.Unmarshal([]byte(`{"isRegistered":true, "firstName":"Marcus", "lastName":"Ellison"}`), &otherUser)

	m := map[string]interface{}{
		"appName":    "mainagreement",
		"agreement":  agrmntData,
		"payments":   paymentsData,
		"tasks":      tasksData,
		"otherUser":  otherUser,
		"thisUser":   thisUser,
		"signedIn":   session.Values["signedIn"],
		"sample":     true,
		"production": Production,
		"JSversion":  JSversion,
		"CSSversion": CSSversion,
	}

	tpl, _ := template.New("_baseApp.html").Funcs(template.FuncMap{"unescape": unescaped}).ParseFiles(
		"templates/_baseApp.html",
		"templates/freelancer_perspective_agreement.html",
	)

	tpl.Execute(w, m)
}
