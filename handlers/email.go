package handlers

import (
	"bytes"
	"log"
	"net/http"
)

func EmailHead(w http.ResponseWriter, req *http.Request) {

}

func EmailPost(w http.ResponseWriter, req *http.Request) {
	buf := new(bytes.Buffer)
	buf.ReadFrom(req.Body)
	log.Printf("email body is %s", buf.String())
}
