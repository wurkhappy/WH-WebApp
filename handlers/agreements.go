package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	"github.com/gorilla/sessions"
	"html/template"
	// "log"
	"net/http"
	"time"
)

// var agreementTemplates = template.Must(template.ParseFiles("templates/agreements.html", "templates/createAgreements.html"))

func GetHome(w http.ResponseWriter, req *http.Request, session *sessions.Session) {

	client := &http.Client{}
	r, _ := http.NewRequest("GET", "http://localhost:4050/agreements?userID="+session.Values["id"].(string), nil)
	resp, err := client.Do(r)
	if err != nil {
		fmt.Printf("Error : %s", err)
	}

	buf := new(bytes.Buffer)
	buf.ReadFrom(resp.Body)
	var agreementsData []map[string]interface{}
	json.Unmarshal(buf.Bytes(), &agreementsData)

	m := map[string]interface{}{
		"appName":    "mainhome",
		"agreements": agreementsData,
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

func GetAgreementDetails(w http.ResponseWriter, req *http.Request, session *sessions.Session) {

	m := map[string]interface{}{
	// "appName": "maincreateagreement",
	}
	var index = template.Must(template.ParseFiles(
		"templates/_baseApp.html",
		"templates/freelancer_perspective_agreement.html",
	))
	index.Execute(w, m)

}

// func BuildTemplate(dir string, funcMap template.FuncMap) (*template.Template, error) {
//     fs, err := ioutil.ReadDir(dir)
//     if err != nil {
//         fmt.Printf("Can't read template folder: %s\n", dir)
//         return nil, err
//     }
//     files := make([]string, len(fs))
//     for i, f := range (fs) {
//         files[i] = path.Join(dir, f.Name())
//     }
//     return template.Must(template.New("Template").Funcs(funcMap).ParseFiles(files...)), nil
// }
