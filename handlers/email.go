package handlers

import (
	"bytes"
	"encoding/json"
	rbtmq "github.com/wurkhappy/Rabbitmq-go-wrapper"
	"github.com/wurkhappy/WH-Config"
	"net/http"
)

func EmailHead(w http.ResponseWriter, req *http.Request) {

}

func EmailPost(w http.ResponseWriter, req *http.Request) {
	buf := new(bytes.Buffer)
	buf.ReadFrom(req.Body)

	payload := map[string]interface{}{
		"Body": map[string]interface{}{
			"message": buf.String(),
		},
	}

	body, _ := json.Marshal(payload)
	publisher, _ := rbtmq.NewPublisher(connection, config.EmailExchange, "direct", config.EmailQueue, "/comment/reply")
	publisher.Publish(body, true)
}

