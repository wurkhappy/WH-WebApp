package handlers

type Status struct {
	Name            string `json:"name,omitempty"`
	Message         string `json:"message,omitempty"`
	UserID          string `json:"userID,omitempty"`
	CreditSourceURI string `json:"creditSourceID,omitempty"`
	DebitSourceURI  string `json:"debitSourceID,omitempty"`
	PaymentType     string `json:"paymentType,omitempty"`
}
