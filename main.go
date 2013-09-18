package main

import (
	"github.com/boj/redistore"
	"github.com/gorilla/mux"
	"github.com/gorilla/sessions"
	"github.com/wurkhappy/WH-WebApp/handlers"
	"html/template"
	"log"
	"net/http"
)

var secretKey string = "pnoy9JBBKwB2mPq5"

func serveSingle(pattern string, filename string) {
	http.HandleFunc(pattern, func(w http.ResponseWriter, r *http.Request) {
		log.Print("yes")
		http.ServeFile(w, r, filename)
	})
}

func hello(w http.ResponseWriter, req *http.Request) {
	m := map[string]interface{}{
		"appName": "mainlanding",
	}
	var index = template.Must(template.ParseFiles(
		"templates/_baseLanding.html",
		"templates/landing.html",
	))
	index.Execute(w, m)
}

func main() {
	r := mux.NewRouter()
	r.HandleFunc("/", hello).Methods("GET")
	r.Handle("/user/login", loginHandler(handlers.PostLogin)).Methods("POST")
	r.Handle("/user/new", loginHandler(handlers.CreateUser)).Methods("POST")
	r.Handle("/home/freelancer", baseHandler(handlers.GetFreelanceAgrmt)).Methods("GET")
	r.Handle("/agreements/new", baseHandler(handlers.GetCreateAgreement)).Methods("GET")
	http.Handle("/", r)
	// http.HandleFunc("/www/", func(w http.ResponseWriter, r *http.Request) {
	// 	http.ServeFile(w, r, r.URL.Path[1:])
	// })
	http.Handle("/img/", http.StripPrefix("/img/", http.FileServer(http.Dir("www/img"))))
	http.Handle("/js/", http.StripPrefix("/js/", http.FileServer(http.Dir("www/js"))))
	http.Handle("/css/", http.StripPrefix("/css/", http.FileServer(http.Dir("www/css"))))
	http.ListenAndServe(":4000", nil)
}

type baseHandler func(http.ResponseWriter, *http.Request, *sessions.Session)

func (h baseHandler) ServeHTTP(w http.ResponseWriter, req *http.Request) {

	store := redistore.NewRediStore(10, "tcp", ":6379", "", []byte(secretKey))
	defer store.Close()

	// Get a session.
	session, err := store.Get(req, "WebAppSessions")
	if err != nil {
	}
	session.Options.MaxAge = 24 * 60 * 60

	if _, ok := session.Values["id"]; ok {
		h(w, req, session)
	} else {
		http.Redirect(w, req, "/login", http.StatusFound)
	}

}

type loginHandler func(http.ResponseWriter, *http.Request, *sessions.Session)

func (h loginHandler) ServeHTTP(w http.ResponseWriter, req *http.Request) {

	store := redistore.NewRediStore(10, "tcp", ":6379", "", []byte(secretKey))
	defer store.Close()

	// Get a session.
	session, err := store.Get(req, "WebAppSessions")
	if err != nil {
	}
	session.Options.MaxAge = 24 * 60 * 60
	h(w, req, session)
}
