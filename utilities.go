package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/garyburd/redigo/redis"
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
	Expiration int  `redis:"expiration"`
	UserID     string `redis:"userID"`
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
