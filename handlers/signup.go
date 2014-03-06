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
	m := map[string]interface{}{
		"appName":    "mainsignup",
		"production": Production,
		"JSversion":  JSversion,
		"CSSversion": CSSversion,
	}
	var index = template.Must(template.ParseFiles(
		"templates/_baseApp.html",
		"templates/signup.html",
	))
	index.Execute(w, m)
}
