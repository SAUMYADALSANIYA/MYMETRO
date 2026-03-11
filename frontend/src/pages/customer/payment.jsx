import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { payTicket } from "./api";
import "./payment.css";

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const metro = location.state; 
  const [cardNumber, setCardNumber] = useState("");
  const [name, setName] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); 
 
  if (!metro) {
    return (
      <div className="paymentPage">
        <h2>No trip selected</h2>
        <button onClick={() => navigate("/customer")}>Go Back</button>
      </div>
    );
  }

  async function handlePayment() {
    
    if(cardNumber.length !== 16){
        alert("Card number must be 16 digits");
        return;
      }

    setResult(null);
    setLoading(true);
  
    setTimeout(async () => {
  
      try {
  
        const data = await payTicket({
          source: metro.source,
          destination: metro.destination,
          amount: metro.fare,
          cardNumber: cardNumber,
          cardHolder: name
        });
  
        console.log("Payment response:", data);
  
        setResult("success");
  
      } catch (e) {
  
        setResult("fail");
  
      }
  
      setLoading(false);
  
    }, 2000);
  
  }

  return (
    <div className="paymentPage">
      <h1>Metro Ticket Payment</h1>

      <div className="paymentCard">
        <div className="row"><span>Route</span><span>{metro.routeName}</span></div>
        <div className="row"><span>From</span><span>{metro.source}</span></div>
        <div className="row"><span>To</span><span>{metro.destination}</span></div>
        <div className="row"><span>Stops</span><span>{metro.stops}</span></div>
        <div className="row fare"><span>Total Fare</span><span>₹{metro.fare}</span></div>

        <input
        type = "text"
          placeholder="Card Number"
          value={cardNumber}
          maxLenght={16}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            setCardNumber(value);
          }}
        />

        <input
         
          placeholder="Card Holder Name"
          value={name}
          
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="password"
          placeholder="CVV"
          value={cvv}
          onChange={(e) => setCvv(e.target.value)}
        />

        <button className="payBtn" onClick={handlePayment} disabled={loading}>
          Pay Now
        </button>
      </div>

      {loading && <div className="loader">Processing Payment...</div>}

      {result === "success" && (
        <div className="successMsg">Payment Successful ✅ Ticket Generated</div>
      )}

      {result === "fail" && (
        <div className="failMsg">Payment Failed ❌ Please Try Again</div>
      )}

      <button className="backBtn" onClick={() => navigate(-1)}>Back</button>
    </div>
  );
}