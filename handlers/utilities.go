package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/wurkhappy/WH-WebApp/config"
	"net/http"
)

var UserService string = config.UserService
var PaymentInfoService string = config.PaymentInfoService
var AgreementsService string = config.AgreementsService
var CommentsService string = config.CommentsService

func getUserInfo(id string) map[string]interface{} {
	if id == "" {
		return make(map[string]interface{})
	}
	client := &http.Client{}
	r, _ := http.NewRequest("GET", UserService+"/user/search?userid="+id, nil)
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

func sendRequest(r *http.Request) (map[string]interface{}, []byte) {
	client := &http.Client{}
	resp, err := client.Do(r)
	if err != nil {
		fmt.Printf("Error : %s", err)
	}
	respBuf := new(bytes.Buffer)
	respBuf.ReadFrom(resp.Body)
	var respData map[string]interface{}
	json.Unmarshal(respBuf.Bytes(), &respData)
	return respData, respBuf.Bytes()
}

func sendRequestArray(r *http.Request) ([]map[string]interface{}, []byte) {
	client := &http.Client{}
	resp, err := client.Do(r)
	if err != nil {
		fmt.Printf("Error : %s", err)
	}
	respBuf := new(bytes.Buffer)
	respBuf.ReadFrom(resp.Body)
	var respData []map[string]interface{}
	json.Unmarshal(respBuf.Bytes(), &respData)
	return respData, respBuf.Bytes()
}

type responseError struct {
	Description string `json:"description"`
	StatusCode  int    `json:"status_code"`
}
