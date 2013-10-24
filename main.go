package main

import (
	"bytes"
	"encoding/json"
	"fmt"
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

	r.Handle("/password/forgot", loginHandler(handlers.ForgotPassword)).Methods("POST")
	r.Handle("/user/login", loginHandler(handlers.PostLogin)).Methods("POST")
	r.Handle("/user/logout", loginHandler(handlers.Logout)).Methods("GET")
	r.Handle("/user/new", loginHandler(handlers.CreateUser)).Methods("POST")
	r.Handle("/user/{id}", loginHandler(handlers.UpdateUser)).Methods("PUT")
	r.Handle("/user/{id}/verify", loginHandler(handlers.VerifyUser)).Methods("GET")
	r.Handle("/user/{id}/cards", baseHandler(handlers.SaveCard)).Methods("POST")
	r.Handle("/user/{id}/cards/{cardID}", baseHandler(handlers.DeleteCard)).Methods("DELETE")

	r.Handle("/home", baseHandler(handlers.GetHome)).Methods("GET")

	r.Handle("/account", baseHandler(handlers.GetAccount)).Methods("GET")

	r.Handle("/signup", loginHandler(handlers.GetSignup)).Methods("GET")

	r.Handle("/agreement/{agreementID}/payment/{paymentID}/status", baseHandler(handlers.CreatePaymentStatus)).Methods("POST")
	r.Handle("/agreement/{agreementID}/status", baseHandler(handlers.CreateAgreementStatus)).Methods("POST")
	r.Handle("/agreement/{agreementID}/comments", baseHandler(handlers.CreateComment)).Methods("POST")

	r.Handle("/agreements/new", baseHandler(handlers.GetCreateAgreement)).Methods("GET")
	r.Handle("/agreement", baseHandler(handlers.PostFreelanceAgrmt)).Methods("POST")
	r.Handle("/agreement/{id}", baseHandler(handlers.PutFreelanceAgrmt)).Methods("PUT")
	r.Handle("/agreement/{id}", baseHandler(handlers.GetAgreementDetails)).Methods("GET")
	http.Handle("/", r)

	//static content
	serveSingle("/favicon.ico", "favicon.ico")
	http.Handle("/img/", http.StripPrefix("/img/", http.FileServer(http.Dir("www/img"))))
	http.Handle("/_img/", http.StripPrefix("/_img/", http.FileServer(http.Dir("www/img"))))
	http.Handle("/js/", http.StripPrefix("/js/", http.FileServer(http.Dir("www/js"))))
	http.Handle("/css/", http.StripPrefix("/css/", http.FileServer(http.Dir("www/css"))))
	http.ListenAndServe(":4000", nil)
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

type baseHandler func(http.ResponseWriter, *http.Request, *sessions.Session)

func (h baseHandler) ServeHTTP(w http.ResponseWriter, req *http.Request) {

	store := redistore.NewRediStore(10, "tcp", ":6379", "", []byte(secretKey))
	defer store.Close()

	// Get a session.
	session, err := store.Get(req, "WebAppSessions")
	if err != nil {
	}
	session.Options.MaxAge = 24 * 60 * 60

	if checkForValidSignature(req) {
		//if it's a valid sig then let's check if the user is already logged in
		//if they're not then we need some info about them for the handler
		//if they are a verified user then we treat this as a log in
		if _, ok := session.Values["id"]; !ok {
			user := getUserInfo(req.FormValue("access_key"))
			session.Values["id"] = user["id"].(string)
			session.Values["isVerified"] = user["isVerified"].(bool)
			if user["isVerified"].(bool) {
				session.Save(req, w)
			}
		}
	}

	if _, ok := session.Values["id"]; ok {
		h(w, req, session)
	} else {
		http.Redirect(w, req, "/", http.StatusFound)
	}

}

func checkForValidSignature(req *http.Request) bool {
	req.ParseForm()
	if req.FormValue("signature") == "" {
		return false
	}
	id := req.FormValue("access_key")
	path := req.URL.Path
	signature := req.FormValue("signature")
	return validSignature(id, path, signature)
}

func validSignature(id, path, signature string) bool {
	m := map[string]string{
		"path":      path,
		"signature": signature,
	}
	jsonData, _ := json.Marshal(m)
	body := bytes.NewReader(jsonData)
	r, _ := http.NewRequest("POST", "http://localhost:3000/user/"+id+"/sign/verify", body)
	client := &http.Client{}
	resp, err := client.Do(r)
	if err != nil {
		fmt.Printf("Error : %s", err)
		return false
	}

	if resp.StatusCode >= 400 {
		return false
	}

	return true
}

func getUserInfo(id string) map[string]interface{} {
	if id == "" {
		return make(map[string]interface{})
	}
	client := &http.Client{}
	r, _ := http.NewRequest("GET", "http://localhost:3000/user/search?userid="+id, nil)
	resp, err := client.Do(r)
	if err != nil {
		fmt.Printf("Error : %s", err)
	}
	clientBuf := new(bytes.Buffer)
	clientBuf.ReadFrom(resp.Body)
	var clientData []map[string]interface{}
	json.Unmarshal(clientBuf.Bytes(), &clientData)
	if len(clientData) > 0 {
		return clientData[0]
	}
	return nil
}
