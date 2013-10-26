package handlers

type Status struct {
	Action      string `json:"action,omitempty"`
	Message     string `json:"message,omitempty"`
	AgreementID string `json:"agreementID,omitempty"`
	PaymentID   string `json:"paymentID,omitempty"`
	UserID      string `json:"userID,omitempty"`
}
