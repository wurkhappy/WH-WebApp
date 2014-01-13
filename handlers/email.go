package handlers

import (
	"bytes"
	"encoding/json"
	// "fmt"
	rbtmq "github.com/wurkhappy/Rabbitmq-go-wrapper"
	"github.com/wurkhappy/WH-Config"
	"net/http"
)

func EmailHead(w http.ResponseWriter, req *http.Request) {

}

func EmailPost(w http.ResponseWriter, req *http.Request) {
	req.ParseMultipartForm(32 << 20)
	data, _ := json.Marshal(req.Form)
	payload := map[string]interface{}{
		"Body": map[string]interface{}{
			"message": data,
		},
	}

	body, _ := json.Marshal(payload)
	publisher, err := rbtmq.NewPublisher(connection, config.EmailExchange, "direct", config.EmailQueue, "/comment/reply")
	if err != nil {
		publisher, _ = rbtmq.NewPublisher(connection, config.EmailExchange, "direct", config.EmailQueue, "/comment/reply")
	}
	publisher.Publish(body, true)
}

func BalancedHead(w http.ResponseWriter, req *http.Request) {

}

type Callback struct {
	EventType string `json:"type"`
}

func BalancedPost(w http.ResponseWriter, req *http.Request) {
	buf := new(bytes.Buffer)
	buf.ReadFrom(req.Body)
	var callback *Callback
	json.Unmarshal(buf.Bytes(), &callback)

	if callback.EventType == "debit.succeeded" {
		payload := map[string]interface{}{
			"Method": "POST",
			"Body":   buf.Bytes(),
		}

		body, _ := json.Marshal(payload)
		publisher, err := rbtmq.NewPublisher(connection, config.TransactionsExchange, "direct", config.TransactionsQueue, "/debit/process")
		if err != nil {
			publisher, _ = rbtmq.NewPublisher(connection, config.TransactionsExchange, "direct", config.TransactionsQueue, "/debit/process")
		}
		publisher.Publish(body, true)
	}

}
