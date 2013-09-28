package handlers

import (
	//"bytes"
	//"encoding/json"
	//"fmt"
	//"github.com/gorilla/mux"
	"github.com/gorilla/sessions"
	"html/template"
	"net/http"
)

func GetSignup(w http.ResponseWriter, req *http.Request, session *sessions.Session) {

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
		"appName": "mainsignup",
	}
	var index = template.Must(template.ParseFiles(
		"templates/_baseApp.html",
		"templates/signup.html",
	))
	index.Execute(w, m)
}
