import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { payTicket, payExtraFare } from "./api";
import "./payment.css";

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const metro = location.state;
  
  const [paymentMethod, setPaymentMethod] = useState("card"); // 👈 added payment method state
  const [upiId, setUpiId] = useState("");                     // 👈 added upi id state
  
  const [cardNumber, setCardNumber] = useState("");
  const [name, setName] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  if (!metro) {
    return (
      <div className="paymentPage">
        <h2>No trip selected</h2>
        <button onClick={() => navigate("/customer")}>Go Back</button>
      </div>
    );
  }

  async function handlePayment() {
    let finalCardNumber = cardNumber;
    let finalName = name;
    let finalCvv = cvv;

    if (paymentMethod === "card") {
      if (cardNumber.length !== 16) {
        alert("Card number must be 16 digits");
        return;
      }
      if (!name.trim()) {
        alert("Please enter card holder name");
        return;
      }
      if (cvv.length !== 3) {
        alert("CVV must be 3 digits");
        return;
      }
    } else {
      if (!upiId.trim() || !upiId.includes("@")) {
        alert("Please enter a valid UPI ID (e.g., user@upi)");
        return;
      }
      // Dummy values to satisfy the existing backend constraints
      finalCardNumber = "1234123412341234";
      finalName = "UPI Payment";
      finalCvv = "123";
    }

    setResult(null);
    setErrorMsg("");
    setLoading(true);
    try {
      let data;
      if (metro.parentTicketId) {
        data = await payExtraFare({
          parentTicketId: metro.parentTicketId,
          routeId: metro.routeId,
          routeName: metro.routeName,
          source: metro.source,
          destination: metro.destination,
          cardNumber: finalCardNumber,
          cardHolder: finalName,
          cvv: finalCvv,
        });
      } else {
        data = await payTicket({
          routeId: metro.routeId,
          routeName: metro.routeName,
          source: metro.source,
          destination: metro.destination,
          cardNumber: finalCardNumber,
          cardHolder: finalName,
          cvv: finalCvv,
        });
      }
      setResult("success");
      setTimeout(() => {
        navigate("/customer/ticket", {
          state: { ticket: data.ticket },
        });
      }, 1000);
    } catch (e) {
      console.error(e);
      setResult("fail");
      // Set the exact error message from the backend API so we know why it failed
      setErrorMsg(e.message || "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="paymentPage">
      <h1>Metro Ticket Payment</h1>

      <div className="paymentCard">
        {/* Trip summary block */}
        <div className="tripSummary">
          <div className="row"><span>Route</span><span>{metro.routeName}</span></div>
          <div className="row"><span>From</span><span>{metro.source}</span></div>
          <div className="row"><span>To</span><span>{metro.destination}</span></div>
          <div className="row"><span>Stops</span><span>{metro.stops}</span></div>
          <div className="row fare"><span>Total Fare</span><span>₹{metro.fare}</span></div>
        </div>

        <div className="paymentMethodSelector">
          <label className="paymentMethodOption">
            <input 
              type="radio" 
              name="paymentMethod" 
              value="card" 
              checked={paymentMethod === "card"} 
              onChange={() => setPaymentMethod("card")} 
            />
            <div className="paymentMethodCard">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
              Credit / Debit Card
            </div>
          </label>
          
          <label className="paymentMethodOption">
            <input 
              type="radio" 
              name="paymentMethod" 
              value="upi" 
              checked={paymentMethod === "upi"} 
              onChange={() => setPaymentMethod("upi")} 
            />
            <div className="paymentMethodCard">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
                <rect x="9" y="9" width="6" height="6" />
                <line x1="9" y1="1" x2="9" y2="4" />
                <line x1="15" y1="1" x2="15" y2="4" />
                <line x1="9" y1="20" x2="9" y2="23" />
                <line x1="15" y1="20" x2="15" y2="23" />
                <line x1="20" y1="9" x2="23" y2="9" />
                <line x1="20" y1="14" x2="23" y2="14" />
                <line x1="1" y1="9" x2="4" y2="9" />
                <line x1="1" y1="14" x2="4" y2="14" />
              </svg>
              UPI Payment
            </div>
          </label>
        </div>

        {paymentMethod === "card" ? (
          <>
            <p className="sectionLabel">Card Details</p>
            <input
              type="text"
              placeholder="Card Number"
              value={cardNumber}
              maxLength={16}
              onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ""))}
            />
            <input
              type="text"
              placeholder="Card Holder Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="password"
              placeholder="CVV"
              value={cvv}
              maxLength={3}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
            />
          </>
        ) : (
          <>
            <p className="sectionLabel">UPI Details</p>
            <input
              type="text"
              placeholder="Enter UPI ID (e.g. john@okhdfc)"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
            />
          </>
        )}

        <button className="payBtn" onClick={handlePayment} disabled={loading}>
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </div>

      {loading && <div className="loader">Processing Payment</div>}

      {result === "success" && (
        <div className="successMsg">Payment Successful. Ticket Generated</div>
      )}

      {result === "fail" && (
        <div className="failMsg">
          Payment Failed!
          <span style={{ fontSize: "14px", color: "#666", fontWeight: "normal", display: "block", marginTop: "5px" }}>
            Reason: {errorMsg}
          </span>
        </div>
      )}

      <button className="backBtn" onClick={() => navigate(-1)}>Back</button>
    </div>
  );
}
