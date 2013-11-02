package main

import (
	"github.com/gorilla/mux"
	"github.com/wurkhappy/WH-WebApp/handlers"
	"html/template"
	"net/http"
)

func initRoutes(r *mux.Router) {
	r.HandleFunc("/", home).Methods("GET")

	r.Handle("/password/forgot", loginHandler(handlers.ForgotPassword)).Methods("POST")
	r.Handle("/user/login", loginHandler(handlers.PostLogin)).Methods("POST")
	r.Handle("/user/logout", loginHandler(handlers.Logout)).Methods("GET")
	r.Handle("/user", loginHandler(handlers.CreateUser)).Methods("POST")

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

	r.Handle("/account", baseHandler(handlers.GetAccount)).Methods("GET")

	r.Handle("/signup", loginHandler(handlers.GetSignup)).Methods("GET")

	r.Handle("/agreement/v/{versionID}/payment/{paymentID}/status", versionHandler(handlers.CreatePaymentStatus)).Methods("POST")
	r.Handle("/agreement/v/{versionID}/status", versionHandler(handlers.CreateAgreementStatus)).Methods("POST")
	r.Handle("/agreement/{agreementID}/comments", agreementHandler(handlers.CreateComment)).Methods("POST")

	r.Handle("/agreements/new", baseHandler(handlers.GetCreateAgreement)).Methods("GET")
	r.Handle("/agreement/v", baseHandler(handlers.PostFreelanceAgrmt)).Methods("POST")
	r.Handle("/agreement/v/{id}", versionHandler(handlers.PutFreelanceAgrmt)).Methods("PUT")
	r.Handle("/agreement/v/{id}", versionHandler(handlers.GetAgreementDetails)).Methods("GET")
	r.Handle("/agreement/v/{id}", versionHandler(handlers.DeleteAgreement)).Methods("DELETE")
	r.Handle("/agreements/v/{id}/archive", versionHandler(handlers.ArchiveAgreement)).Methods("POST")
}

func home(w http.ResponseWriter, req *http.Request) {
	m := map[string]interface{}{
		"appName": "mainlanding",
	}
	var index = template.Must(template.ParseFiles(
		"templates/_baseLanding.html",
		"templates/landing.html",
	))
	index.Execute(w, m)
}
