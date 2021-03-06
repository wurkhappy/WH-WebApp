package main

import (
	"github.com/gorilla/mux"
	"github.com/wurkhappy/WH-WebApp/handlers"
	"html/template"
	"math/rand"
	"net/http"
	"time"
)

func initRoutes(r *mux.Router) {
	r.HandleFunc("/", landing).Methods("GET")

	r.Handle("/password/forgot", noAuth(handlers.ForgotPassword)).Methods("POST")
	r.Handle("/user/login", noAuth(handlers.PostLogin)).Methods("POST")
	r.Handle("/user/logout", noAuth(handlers.Logout)).Methods("GET")
	r.Handle("/user", noAuth(handlers.CreateUser)).Methods("POST")
	r.Handle("/users", noAuth(handlers.SearchUsers)).Methods("GET")

	r.Handle("/user/new-password", baseHandler(handlers.GetNewPasswordPage)).Methods("GET")
	r.Handle("/user/{id}", userHandler(handlers.UpdateUser)).Methods("PUT")
	r.Handle("/user/{id}/verify", userHandler(handlers.VerifyUser)).Methods("GET")
	r.Handle("/user/{id}/cards", userHandler(handlers.GetCards)).Methods("GET")
	r.Handle("/user/{id}/cards", userHandler(handlers.SaveCard)).Methods("POST")
	r.Handle("/user/{id}/cards/{cardID}", userHandler(handlers.DeleteCard)).Methods("DELETE")
	r.Handle("/user/{id}/bank_account", userHandler(handlers.GetBankAccounts)).Methods("GET")
	r.Handle("/user/{id}/bank_account", userHandler(handlers.SaveBankAccount)).Methods("POST")
	r.Handle("/user/{id}/bank_account/{accountID}", userHandler(handlers.DeleteBankAccount)).Methods("DELETE")
	r.Handle("/user/{id}/bank_account/{accountID}/verify", userHandler(handlers.VerifyBankAccount)).Methods("POST")
	r.Handle("/user/{id}/password", userHandler(handlers.SetNewPassword)).Methods("PUT")

	r.Handle("/home", baseHandler(handlers.GetHome)).Methods("GET")
	r.Handle("/home/sample", noAuth(handlers.GetHomeSample)).Methods("GET")
	r.Handle("/archive", baseHandler(handlers.GetArchives)).Methods("GET")
	r.HandleFunc("/about", about).Methods("GET")
	r.HandleFunc("/pricing", pricing).Methods("GET")
	r.HandleFunc("/legal", legal).Methods("GET")

	r.Handle("/account", baseHandler(handlers.GetAccount)).Methods("GET")

	r.Handle("/signup", noAuth(handlers.GetSignup)).Methods("GET")

	r.Handle("/payments/{paymentID}/action", baseHandler(handlers.CreatePaymentAction)).Methods("POST")
	r.Handle("/payments/{paymentID}", baseHandler(handlers.UpdatePayment)).Methods("PUT")
	r.Handle("/tasks/{taskID}", baseHandler(handlers.UpdateTask)).Methods("PUT")
	r.Handle("/tasks/{taskID}/action", baseHandler(handlers.CreateTaskAction)).Methods("POST")

	r.Handle("/agreements/v/{versionID}/tasks", versionHandler(handlers.CreateTasks)).Methods("POST")
	r.Handle("/agreements/v/{versionID}/payments", versionHandler(handlers.CreatePayments)).Methods("POST")
	r.Handle("/agreement/v/{versionID}/status", versionHandler(handlers.CreateAgreementStatus)).Methods("POST")
	r.Handle("/agreement/sample", noAuth(handlers.GetSample)).Methods("GET")

	r.Handle("/agreements/new", noAuth(handlers.GetCreateAgreement)).Methods("GET")
	r.Handle("/agreement/v", noAuth(handlers.PostFreelanceAgrmt)).Methods("POST")
	r.Handle("/agreement/v/{versionID}", versionHandler(handlers.PutFreelanceAgrmt)).Methods("PUT")
	r.Handle("/agreement/v/{versionID}", versionHandler(handlers.GetAgreementDetails)).Methods("GET")
	r.Handle("/agreement/v/{versionID}", versionHandler(handlers.DeleteAgreement)).Methods("DELETE")
	r.Handle("/agreement/v/{versionID}/archive", versionHandler(handlers.ArchiveAgreement)).Methods("POST")
	r.Handle("/agreement/v/{versionID}/review", versionHandler(handlers.AgreementReview)).Methods("POST")
}

var landingTpl = template.Must(template.ParseFiles(
	"templates/_baseLanding.html",
	"templates/landing5.html",
))

var landingTpl6 = template.Must(template.ParseFiles(
	"templates/_baseLanding.html",
	"templates/landing6.html",
))

var landingsPages = []string{"5", "6"}

func random(min, max int) int {
	rand.Seed(time.Now().Unix())
	return rand.Intn(max-min) + min
}

func landing(w http.ResponseWriter, req *http.Request) {
	// pageNumberCookie, err := req.Cookie("WH_landing")
	// var pageNumber string
	// if err == nil {
	// 	pageNumber = pageNumberCookie.Value
	// } else {
	// 	pageNumber = landingsPages[random(0, 2)]
	// 	http.SetCookie(w, &http.Cookie{Name: "WH_landing", Value: pageNumber})
	// }
	// var landingTpl *template.Template
	// if pageNumber == "5" || pageNumber == "" {
	// 	landingTpl = landingTpl5
	// } else if pageNumber == "6" {
	// 	landingTpl = landingTpl6
	// }

	session := getSession(req)

	m := map[string]interface{}{
		"appName":    "mainlanding",
		"production": handlers.Production,
		"JSversion":  handlers.JSversion,
		"CSSversion": handlers.CSSversion,
		"signedIn":   session.Values["signedIn"],
	}

	landingTpl.Execute(w, m)
}

func pricing(w http.ResponseWriter, req *http.Request) {
	session := getSession(req)

	m := map[string]interface{}{
		"appName":    "mainlanding",
		"production": handlers.Production,
		"JSversion":  handlers.JSversion,
		"CSSversion": handlers.CSSversion,
		"signedIn":   session.Values["signedIn"],
	}
	var index = template.Must(template.ParseFiles(
		"templates/_baseLanding.html",
		"templates/top_nav.html",
		"templates/pricing.html",
	))
	index.Execute(w, m)
}

func about(w http.ResponseWriter, req *http.Request) {
	session := getSession(req)

	m := map[string]interface{}{
		"production": handlers.Production,
		"JSversion":  handlers.JSversion,
		"CSSversion": handlers.CSSversion,
		"signedIn":   session.Values["signedIn"],
	}
	var index = template.Must(template.ParseFiles(
		"templates/_baseLanding.html",
		"templates/top_nav.html",
		"templates/about.html",
	))
	index.Execute(w, m)
}

/*func pricing(w http.ResponseWriter, req *http.Request) {
	m := map[string]interface{}{
		"production": handlers.Production,
		"JSversion":  handlers.JSversion,
		"CSSversion": handlers.CSSversion,
	}
	var index = template.Must(template.ParseFiles(
		"templates/_base_footer_landing.html",
		"templates/pricing.html",
	))
	index.Execute(w, m)
}*/

func legal(w http.ResponseWriter, req *http.Request) {
	session := getSession(req)

	m := map[string]interface{}{
		"appName":    "mainlegal",
		"production": handlers.Production,
		"JSversion":  handlers.JSversion,
		"CSSversion": handlers.CSSversion,
		"signedIn":   session.Values["signedIn"],
	}
	var index = template.Must(template.ParseFiles(
		"templates/_baseLanding.html",
		"templates/top_nav.html",
		"templates/legal.html",
	))
	index.Execute(w, m)
}
