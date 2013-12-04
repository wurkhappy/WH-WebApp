package handlers

import (
	"bytes"
	"log"
	"net/http"
	"encoding/json"
	"net/url"
)

func EmailHead(w http.ResponseWriter, req *http.Request) {

}

func EmailPost(w http.ResponseWriter, req *http.Request) {
	buf := new(bytes.Buffer)
	buf.ReadFrom(req.Body)
	var m []map[string]interface{}
	log.Print(buf.String())
	s, err := url.QueryUnescape(buf.String())
	s = s[16:]
	err = json.Unmarshal([]byte(s), &m)
	log.Print(err)
	//log.Printf("email body is %s", m)
	//log.Printf("email body is %s", m[0]["text"])
}
