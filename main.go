package main

import (
	// "bytes"
	// "encoding/json"
	// "fmt"
	"github.com/boj/redistore"
	"github.com/garyburd/redigo/redis"
	"github.com/gorilla/mux"
	"github.com/gorilla/sessions"
	"net/http"
	// "strconv"
	// "time"
	"log"
)

//for hashing cookies
var secretKey string = "pnoy9JBBKwB2mPq5"
var store *redistore.RediStore
var redisPool *redis.Pool

func main() {
	store = redistore.NewRediStore(10, "tcp", ":6379", "", []byte(secretKey))
	defer store.Close()
	redisPool = store.Pool

	r := mux.NewRouter()
	initRoutes(r)
	http.Handle("/", r)

	//static content
	serveSingle("/favicon.ico", "favicon.ico")
	http.Handle("/img/", http.StripPrefix("/img/", http.FileServer(http.Dir("www/img"))))
	http.Handle("/_img/", http.StripPrefix("/_img/", http.FileServer(http.Dir("www/img"))))
	http.Handle("/js/", http.StripPrefix("/js/", http.FileServer(http.Dir("www/js"))))
	http.Handle("/css/", http.StripPrefix("/css/", http.FileServer(http.Dir("www/css"))))
	err := http.ListenAndServe(":4000", nil)
	if err != nil {
		log.Fatal(err)
	}
}

func serveSingle(pattern string, filename string) {
	http.HandleFunc(pattern, func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, filename)
	})
}

type loginHandler func(http.ResponseWriter, *http.Request, *sessions.Session)

func (h loginHandler) ServeHTTP(w http.ResponseWriter, req *http.Request) {

	// Get a session.
	session, err := store.Get(req, "WebAppSessions")
	if err != nil {
	}
	session.Options.MaxAge = 24 * 60 * 60
	h(w, req, session)
}

type baseHandler func(http.ResponseWriter, *http.Request, *sessions.Session)

func (h baseHandler) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	session := getSession(req)
	validateSignature(req, session)

	if _, ok := session.Values["id"]; ok {
		h(w, req, session)
	} else {
		http.Redirect(w, req, "/", http.StatusFound)
	}

}

type userHandler func(http.ResponseWriter, *http.Request, *sessions.Session)

func (h userHandler) ServeHTTP(w http.ResponseWriter, req *http.Request) {

	session := getSession(req)
	validateSignature(req, session)
	vars := mux.Vars(req)
	if vars["id"] != session.Values["id"].(string) {
		http.Error(w, "Not authorized", http.StatusForbidden)
		return
	}

	if _, ok := session.Values["id"]; ok {
		h(w, req, session)
	} else {
		http.Redirect(w, req, "/", http.StatusFound)
	}
}

type agreementHandler func(http.ResponseWriter, *http.Request, *sessions.Session)

func (h agreementHandler) ServeHTTP(w http.ResponseWriter, req *http.Request) {

	session := getSession(req)
	validateSignature(req, session)
	vars := mux.Vars(req)
	if !checkAgreementOwner(vars["id"], session.Values["id"].(string)) {
		http.Error(w, "Not authorized", http.StatusForbidden)
		return
	}

	if _, ok := session.Values["id"]; ok {
		h(w, req, session)
	} else {
		http.Redirect(w, req, "/", http.StatusFound)
	}
}

type versionHandler func(http.ResponseWriter, *http.Request, *sessions.Session)

func (h versionHandler) ServeHTTP(w http.ResponseWriter, req *http.Request) {

	session := getSession(req)
	validateSignature(req, session)
	vars := mux.Vars(req)
	if !checkVersionOwner(vars["versionID"], session.Values["id"].(string)) {
		http.Error(w, "Not authorized", http.StatusForbidden)
		return
	}

	if _, ok := session.Values["id"]; ok {
		h(w, req, session)
	} else {
		http.Redirect(w, req, "/", http.StatusFound)
	}
}
