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
      margin: 10,
      filename: `Metro_Ticket_${ticket.qrToken.substring(0,6)}.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff"
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
      <div className="ticketPage empty-ticket">
        <div className="empty-ticket-card">
          <h2>No ticket found</h2>
          <p>Please purchase a ticket to view it here.</p>
          <button className="primary-btn" onClick={() => navigate("/customer")}>Go to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="ticketPage">
      {/* PDF container */}
      <div ref={ticketRef} className="pdfContainer">
        
        {/* The physical ticket card */}
        <div className="ticketCard modern-ticket">
          
          {/* Top Header */}
          <div className="ticketHeader">
            <div className="metro-logo">
              {/* Minimal metro icon SVG */}
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="5" width="16" height="11" rx="3" stroke="white" strokeWidth="1.8"/>
                <rect x="6.5" y="8" width="4" height="3.5" rx="1" fill="white" />
                <rect x="13.5" y="8" width="4" height="3.5" rx="1" fill="white" />
                <circle cx="8.5" cy="18.5" r="1.8" stroke="white" strokeWidth="1.6"/>
                <circle cx="15.5" cy="18.5" r="1.8" stroke="white" strokeWidth="1.6"/>
                <line x1="3" y1="21" x2="21" y2="21" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="header-text">
              <h1>Metro QR Ticket</h1>
              <p>Ahmedabad Metro</p>
            </div>
          </div>

          {/* Ticket Body with Cutouts */}
          <div className="ticketBody">
            <div className="cutout left-cutout"></div>
            <div className="cutout right-cutout"></div>
            
            <div className="ticket-details">
              <div className="ticketRow route-badge">
                <span>{ticket.routeName}</span>
              </div>
              
              <div className="journey-path">
                <div className="station">
                  <span className="label">From</span>
                  <b className="value">{ticket.source}</b>
                </div>
                <div className="journey-arrow">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#2e8b57" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="station text-right">
                  <span className="label">To</span>
                  <b className="value">{ticket.destination}</b>
                </div>
              </div>

              <div className="ticket-meta">
                <div className="meta-box">
                  <span className="label">Fare Paid</span>
                  <b className="value fare">₹{ticket.farePaid}</b>
                </div>
                <div className="meta-box">
                  <span className="label">Status</span>
                  <b className={`value status ${ticket.status.toLowerCase()}`}>{ticket.status}</b>
                </div>
              </div>
            </div>

            <div className="ticket-qr-section">
              <div className="qrBox">
                <img src={ticket.qrCodeDataUrl} alt="QR Ticket" />
              </div>
              <p className="scan-instruction">Scan at the AFC gate to enter</p>
            </div>
          </div>

          {/* Footer */}
          <div className="ticketFooter">
            <div className="dashed-divider"></div>
            <p className="validity-text">Valid for one journey only • Non-transferable</p>
          </div>
        </div>

        {/* Action Buttons (hidden in PDF) */}
        <div className="ticket-actions no-print">
          <button
            className="action-btn scan-btn"
            onClick={() => navigate("/customer/scan/" + ticket.qrToken)}
          >
            <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
              <path d="M4 4H10V10H4V4ZM14 4H20V10H14V4ZM4 14H10V20H4V14ZM14 14H17V17H14V14ZM17 17H20V20H17V17Z" fill="currentColor"/>
            </svg>
            Open Scanner
          </button>

          <button className="action-btn pdf-btn" onClick={downloadPDF}>
            <svg viewBox="0 0 24 24" fill="none" width="20" height="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M7 10L12 15M12 15L17 10M12 15V3"/>
            </svg>
            Download PDF
          </button>
        </div>

      </div>
    </div>
  );
}