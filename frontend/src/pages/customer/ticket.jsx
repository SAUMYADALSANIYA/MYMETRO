import { useLocation, useNavigate } from "react-router-dom";
import "./ticket.css";
import html2pdf from "html2pdf.js";
import { useRef } from "react";

export default function TicketPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const ticket = location.state?.ticket;

  const ticketRef = useRef();

  const downloadPDF = () => {
    const element = ticketRef.current;
    if (!element) return;

    // add print mode
    element.classList.add("print-mode");

    const opt = {
      margin: 0,
      filename: "Metro_Ticket.pdf",
      image: { type: "jpeg", quality: 1 },
      html2canvas: {
        scale: 2,
        useCORS: true
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait"
      }
    };

    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => {
        element.classList.remove("print-mode");
      });
  };

  if (!ticket) {
    return (
      <div className="ticketPage">
        <h2>No ticket found</h2>
        <button onClick={() => navigate("/customer")}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="ticketPage">
      {/* PDF container */}
      <div ref={ticketRef} className="pdfContainer">
        <div className="ticketCard">
          
          {/* Header */}
          <div className="ticketHeader">
            <h1>Metro QR Ticket</h1>
            <p>Ahmedabad Metro</p>
          </div>

          {/* Body */}
          <div className="ticketBody">
            
            <div className="left">
              <div className="ticketRow"><span>Route</span><b>{ticket.routeName}</b></div>
              <div className="ticketRow"><span>From</span><b>{ticket.source}</b></div>
              <div className="ticketRow"><span>To</span><b>{ticket.destination}</b></div>
              <div className="ticketRow"><span>Fare</span><b>₹{ticket.farePaid}</b></div>
              <div className="ticketRow"><span>Status</span><b>{ticket.status}</b></div>
            </div>

            <div className="right">
              <div className="qrBox">
                <img src={ticket.qrCodeDataUrl} alt="QR Ticket" />
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="ticketFooter">
            <p>Valid for one journey only</p>
            
          </div>

          {/* Buttons (hidden in PDF) */}
          <button
            className="demoBtn no-print"
            onClick={() => navigate("/customer/scan/" + ticket.qrToken)}
          >
            Open Scan Page on this device
          </button>

          <button className="pdfBtn no-print" onClick={downloadPDF}>
            Download PDF
          </button>

        </div>
      </div>
    </div>
  );
}