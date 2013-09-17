package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/gorilla/sessions"
	"net/http"
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
	buf.ReadFrom(resp.Body)
	data := buf.Bytes()
	json.Unmarshal(data, &requestData)

	session.Values["id"] = requestData["ID"].(string)
	session.Save(req, w)

	requestData["redirectURL"] = "/agreements"
	d, _ := json.Marshal(requestData)
	w.Write(d)
}
