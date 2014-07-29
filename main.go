package main

import (
	// "bytes"
	// "encoding/json"
	//"fmt"
	"github.com/boj/redistore"
	"github.com/garyburd/redigo/redis"
	"github.com/gorilla/mux"
	"github.com/gorilla/sessions"
	"github.com/wurkhappy/WH-Config"
	"github.com/wurkhappy/WH-WebApp/handlers"
	"net/http"
	// "strconv"
	// "time"
	"flag"
	"log"
	"strings"
	//"github.com/davecgh/go-spew/spew"
)

//for hashing cookies
var secretKey string = "pnoy9JBBKwB2mPq5"
var store *redistore.RediStore
var redisPool *redis.Pool
var production = flag.Bool("production", false, "Production settings")
var jsversion = flag.Int("jsv", 0, "javascript version")
var csssversion = flag.Int("cssv", 0, "css version")

func main() {
	flag.Parse()
	if *production {
		config.Prod()
	} else {
		config.Test()
	}
	handlers.Setup()
	handlers.JSversion = *jsversion
	handlers.CSSversion = *csssversion
	handlers.Production = *production

	//var er error
	store = redistore.NewRediStore(10, "tcp", config.WebAppRedis, "", []byte(secretKey))
	/*if er != nil {
		log.Println("error!", er)
		panic(er)
	}*/

	//defer store.Close()
	redisPool = store.Pool

	r := mux.NewRouter()
	initRoutes(r)
	http.Handle("/", r)

	//static content
	serveSingle("/favicon.ico", "www/favicon.ico")
	serveSingle("/robots.txt", "www/robots.txt")
	http.Handle("/img/", http.StripPrefix("/img/", http.FileServer(http.Dir("www/img"))))
	http.Handle("/_img/", http.StripPrefix("/_img/", http.FileServer(http.Dir("www/img"))))
	http.Handle("/js/", http.StripPrefix("/js/", http.FileServer(http.Dir("www/js"))))
	http.HandleFunc("/css/fonts/", serveFonts)
	http.Handle("/css/", http.StripPrefix("/css/", http.FileServer(http.Dir("www/css"))))
	var err error
	err = http.ListenAndServe(":4000", nil)
	if err != nil {
		log.Fatal(err)
	}
}

func redir(w http.ResponseWriter, req *http.Request) {
	http.Redirect(w, req, "https://wurkhappy.com"+req.RequestURI, http.StatusMovedPermanently)
}

func serveFonts(w http.ResponseWriter, req *http.Request) {
	filename := strings.TrimPrefix(req.URL.Path, "/css/fonts/")
	w.Header().Set("Cache-control", "public, max-age=315360000")
	w.Header().Set("Expires", "Sat, 08 Feb 2020 20:00:00 GMT")
	http.ServeFile(w, req, "www/css/fonts/"+filename)
}

func serveSingle(pattern string, filename string) {
	http.HandleFunc(pattern, func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, filename)
	})
}

type noAuth func(http.ResponseWriter, *http.Request, *sessions.Session)

func (h noAuth) ServeHTTP(w http.ResponseWriter, req *http.Request) {

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
		session.Options.MaxAge = 24 * 60 * 60
		session.Save(req, w)
		h(w, req, session)
	} else {
		http.Redirect(w, req, "/#login", http.StatusFound)
	}

}

type userHandler func(http.ResponseWriter, *http.Request, *sessions.Session)

func (h userHandler) ServeHTTP(w http.ResponseWriter, req *http.Request) {

	session := getSession(req)
	validateSignature(req, session)
	vars := mux.Vars(req)

	if _, ok := session.Values["id"]; ok {
		if vars["id"] != session.Values["id"].(string) {
			http.Error(w, "Not authorized", http.StatusForbidden)
			return
		}
		h(w, req, session)
	} else {
		http.Redirect(w, req, "/#login", http.StatusFound)
	}
}

type agreementHandler func(http.ResponseWriter, *http.Request, *sessions.Session)

func (h agreementHandler) ServeHTTP(w http.ResponseWriter, req *http.Request) {

	session := getSession(req)
	validateSignature(req, session)
	vars := mux.Vars(req)

	if _, ok := session.Values["id"]; ok {
		if !checkAgreementOwner(vars["agreementID"], session.Values["id"].(string)) {
			http.Error(w, "Not authorized", http.StatusForbidden)
			return
		}
		session.Save(req, w)
		h(w, req, session)
	} else {
		http.Redirect(w, req, "/#login", http.StatusFound)
	}
}

type versionHandler func(http.ResponseWriter, *http.Request, *sessions.Session)

func (h versionHandler) ServeHTTP(w http.ResponseWriter, req *http.Request) {

	session := getSession(req)
	validateSignature(req, session)
	vars := mux.Vars(req)

	if _, ok := session.Values["id"]; ok {
		if !checkVersionOwner(vars["versionID"], session.Values["id"].(string)) {
			http.Error(w, "Not authorized", http.StatusForbidden)
			return
		}
		h(w, req, session)
	} else {
		if checkVersionOwner(vars["versionID"], " ") {
			h(w, req, session)
			return
		}
		http.Redirect(w, req, "/#login", http.StatusFound)
	}
}
