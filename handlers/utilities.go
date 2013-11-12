package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/wurkhappy/WH-WebApp/config"
	"github.com/wurkhappy/mdp"
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
	resp, statusCode := sendServiceRequest("GET", config.UserService, "/user/search?userid="+id, nil)
	if statusCode >= 400 {
		return nil
	}

	var clientData []map[string]interface{}
	json.Unmarshal(resp, &clientData)
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

type ServiceResp struct {
	StatusCode float64 `json:"status_code"`
	Body       []byte  `json:"body"`
}

func sendServiceRequest(method, service, path string, body []byte) (response []byte, statusCode int) {
	client := mdp.NewClient("tcp://localhost:5555", false)
	defer client.Close()
	m := map[string]interface{}{
		"Method": method,
		"Path":   path,
		"Body":   body,
	}
	req, _ := json.Marshal(m)
	request := [][]byte{req}
	reply := client.Send([]byte(service), request)
	if len(reply) == 0 {
		return nil, 404
	}
	resp := new(ServiceResp)
	json.Unmarshal(reply[0], &resp)
	return resp.Body, int(resp.StatusCode)
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
