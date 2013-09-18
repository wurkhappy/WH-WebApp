package handlers

import (
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

func CreateAgreement(w http.ResponseWriter, req *http.Request, session *sessions.Session) {

	// client := &http.Client{}
	// r, _ := http.NewRequest("POST", "http://localhost:3000/user", req.Body)
	// resp, err := client.Do(r)
	// if err != nil {
	// 	fmt.Printf("Error : %s", err)
	// }

	// var requestData map[string]interface{}
	// buf := new(bytes.Buffer)
	// buf.ReadFrom(resp.Body)
	// data := buf.Bytes()
	// json.Unmarshal(data, &requestData)

	// session.Values["id"] = requestData["ID"].(string)
	// session.Save(req, w)

	// requestData["redirectURL"] = "/agreements"
	// d, _ := json.Marshal(requestData)
	// w.Write(d)
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
