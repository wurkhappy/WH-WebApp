package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/garyburd/redigo/redis"
	"github.com/gorilla/sessions"
	"github.com/wurkhappy/WH-Config"
	"github.com/wurkhappy/mdp"
	"log"
	"net/http"
	"time"
)

func checkForValidSignature(req *http.Request, c redis.Conn) (valid bool, userID string, err error) {
	req.ParseForm()
	var token string
	if token = req.FormValue("token"); token == "" {
		return false, "", fmt.Errorf("%s", "No token given")
	}
	var sig, reqSig struct {
		Path       string `redis:"path"`
		Method     string `redis:"method"`
		Expiration int    `redis:"expiration"`
		UserID     string `redis:"userID"`
		IsVerified bool   `redis:"verified"`
	}
	reqSig.Path = req.URL.Path
	reqSig.Method = req.Method

	v, err := redis.Values(c.Do("HGETALL", token))
	if err != nil {
		return false, "", fmt.Errorf("%s", "There was an error finding that token")
	}
	if err := redis.ScanStruct(v, &sig); err != nil {
		return false, "", fmt.Errorf("%s", "There was an error parsing that token")
	}
	if sig.Method == reqSig.Method && sig.Path == reqSig.Path {
		if !sig.IsVerified {
			go sendServiceRequest("POST", config.UserService, "/user/"+sig.UserID+"/verify", nil)
		}
		now := time.Now()
		exp := time.Unix(int64(sig.Expiration), 0)
		if now.After(exp) {
			return false, "", fmt.Errorf("%s", "Link has expired")
		}
		return true, sig.UserID, nil
	}
	return false, "", fmt.Errorf("%s", "Invalid signature")

}

func getUserInfo(id string) map[string]interface{} {
	if id == "" {
		return make(map[string]interface{})
	}
	client := &http.Client{}
	r, _ := http.NewRequest("GET", config.UserService+"/user/search?userid="+id, nil)
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

func validateSignature(req *http.Request, session *sessions.Session) {
	if ok, userID, _ := checkForValidSignature(req, redisPool.Get()); ok {
		//if it's a valid sig then let's check if the user is already logged in
		//if they're not then we need some info about them for the handler
		if _, ok := session.Values["id"]; !ok {
			session.Values["id"] = userID
		}
	}
}

func getSession(req *http.Request) *sessions.Session {
	// Get a session.
	session, err := store.Get(req, "WebAppSessions")
	if err != nil {
	}
	session.Options.MaxAge = 24 * 60 * 60
	return session
}

func checkAgreementOwner(agreementid, userid string) bool {
	return checkOwner(agreementid, userid, "/agreements/"+agreementid+"/owners")
}

func checkVersionOwner(agreementid, userid string) bool {
	return checkOwner(agreementid, userid, "/agreements/v/"+agreementid+"/owners")
}

func checkOwner(agreementid, userid, path string) bool {
	var owners struct {
		ClientID     string `json:"clientID" redis:"clientID"`
		FreelancerID string `json:"freelancerID" redis:"freelancerID"`
	}

	c := redisPool.Get()

	//check redis for the agreement
	v, err := redis.Values(c.Do("HGETALL", agreementid))
	redis.ScanStruct(v, &owners)
	if err != nil || len(v) == 0 || owners.ClientID == "" || owners.FreelancerID == "" {
		//if we can't find the agreement then let's ask the agreement service for the owners
		resp, statusCode := sendServiceRequest("GET", config.AgreementsService, path, []byte(""))
		if statusCode >= 400 {
			return false
		}
		json.Unmarshal(resp, &owners)

		//at this point we've found the owners of the agreement so let's cache the data
		if _, err := c.Do("HMSET", agreementid, "clientID", owners.ClientID, "freelancerID", owners.FreelancerID); err != nil {
			log.Panic(err)
		}

		if _, err := c.Do("EXPIRE", agreementid, 7*24*60*60); err != nil {
			log.Panic(err)
		}
		if owners.ClientID == userid || owners.FreelancerID == userid {
			return true
		}

	} else {
		//we found the agreement in the cache so let's check if the request is good
		if owners.ClientID == userid || owners.FreelancerID == userid {
			return true
		}
	}

	return false
}

func sendServiceRequest(method, service, path string, body []byte) (response []byte, statusCode int) {
	client := mdp.NewClient(config.MDPBroker, false)
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

type ServiceResp struct {
	StatusCode float64 `json:"status_code"`
	Body       []byte  `json:"body"`
}
