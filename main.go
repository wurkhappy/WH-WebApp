package main

import (
	"fmt"
	"github.com/boj/redistore"
	"github.com/gorilla/mux"
	"github.com/gorilla/sessions"
	"github.com/wurkhappy/WH-WebApp/handlers"
	"net/http"
)

var secretKey string = "pnoy9JBBKwB2mPq5"

func hello(w http.ResponseWriter, req *http.Request) {
	fmt.Fprintf(w, "Hello, %s!", req.URL.Path[1:])
}

func main() {
	r := mux.NewRouter()
	r.Handle("/world", baseHandler(hello)).Methods("GET")
	r.HandleFunc("/login", hello).Methods("GET")
	r.Handle("/user/new", loginHandler(handlers.CreateUser)).Methods("POST")
	http.Handle("/", r)

	http.ListenAndServe(":5000", nil)
}

type baseHandler func(http.ResponseWriter, *http.Request)

func (h baseHandler) ServeHTTP(w http.ResponseWriter, req *http.Request) {

	store := redistore.NewRediStore(10, "tcp", ":6379", "", []byte(secretKey))
	defer store.Close()

	// Get a session.
	session, err := store.Get(req, "WebAppSessions")
	if err != nil {
	}

	if _, ok := session.Values["id"]; ok {
		h(w, req)
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
	h(w, req, session)
}
