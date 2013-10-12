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

func GetAccount(w http.ResponseWriter, req *http.Request, session *sessions.Session) {
	userID := session.Values["id"]

	user := getUserInfo(userID.(string))

	m := map[string]interface{}{
		"appName": "mainaccount",
		"user": user,
	}
	var index = template.Must(template.ParseFiles(
		"templates/_baseApp.html",
		"templates/account.html",
	))
	index.Execute(w, m)
}
