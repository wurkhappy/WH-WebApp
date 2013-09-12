package handlers

import (
	"fmt"
	"github.com/gorilla/sessions"
	"net/http"
	"bytes"
)

func CreateUser(w http.ResponseWriter, req *http.Request, session *sessions.Session) {

	client := &http.Client{}
	r, _ := http.NewRequest("POST", "http://localhost:3000/user", req.Body)
	resp, err := client.Do(r)
	if err != nil {
		fmt.Printf("Error : %s", err)
	}

	var requestData map[string]interface{}
	buf := new(bytes.Buffer)
	buf.ReadFrom(req.Body)
	data := buf.Bytes()
	json.Unmarshal(data, &requestData)

	session.Values["id"] = requestData["ID"].(string)
	session.Save(req, w)

	w.Write(data)
}
