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
      <div className="ticket-page-container empty-ticket">
        <div className="empty-ticket-card">
          <h2>No ticket found</h2>
          <p>Please purchase a ticket to view it here.</p>
          <button className="primary-btn" onClick={() => navigate("/customer")}>Go to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="ticket-page-container">
      <div className="pdf-container">
        
        {/* The physical ticket card */}
        <div ref={ticketRef} className="vertical-ticket">
          
          {/* Top Green Header */}
          <div className="ticket-header">
            <div className="train-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="30" height="30">
                <rect x="3" y="5" width="18" height="12" rx="3" stroke="white" strokeWidth="2"/>
                <rect x="6.5" y="8" width="4" height="3.5" rx="1" fill="white" />
                <rect x="13.5" y="8" width="4" height="3.5" rx="1" fill="white" />
                <circle cx="7.5" cy="19" r="1.8" stroke="white" strokeWidth="2"/>
                <circle cx="16.5" cy="19" r="1.8" stroke="white" strokeWidth="2"/>
                <line x1="2" y1="22" x2="22" y2="22" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="header-text">
              <h1>Metro QR Ticket</h1>
              <p>AHMEDABAD METRO</p>
            </div>
          </div>

          {/* Ticket Body Top */}
          <div className="ticket-body-top">
            <div className="route-badge">
              <span>{ticket.routeName || "INTERCHANGE ROUTE"}</span>
            </div>
            
            <div className="journey-path">
              <div className="station left">
                <span className="label">FROM</span>
                <span className="name">{ticket.source}</span>
              </div>
              <div className="arrow">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
              <div className="station right">
                <span className="label">TO</span>
                <span className="name">{ticket.destination}</span>
              </div>
            </div>

            <div className="ticket-meta-info">
              <div className="meta-block left">
                <span className="label">FARE PAID</span>
                <span className="value text-green">₹{ticket.farePaid}</span>
              </div>
              <div className="meta-block right">
                <span className="label">STATUS</span>
                <span className={`value status-${ticket.status?.toLowerCase() || 'active'}`}>{ticket.status || 'ACTIVE'}</span>
              </div>
            </div>
          </div>

          {/* Divider Section with Cutouts */}
          <div className="ticket-divider-section">
            <div className="cutout cutout-left"></div>
            <div className="dashed-line"></div>
            <div className="cutout cutout-right"></div>
          </div>

          {/* Ticket Body Bottom (QR) */}
          <div className="ticket-body-bottom">
            <div className="qr-wrapper">
              <img src={ticket.qrCodeDataUrl} alt="QR Ticket" />
            </div>
            <p className="scan-instruction">Scan at the AFC gate to enter</p>
          </div>
          
          {/* Grey Footer */}
          <div className="ticket-footer-bar">
            VALID FOR ONE JOURNEY ONLY • NON-TRANSFERABLE
          </div>

        </div>

        {/* Action Buttons */}
        <div className="ticket-actions no-print">
          <button
            className="btn-scan"
            onClick={() => navigate("/customer/scan/" + ticket.qrToken)}
          >
            <svg viewBox="0 0 24 24" fill="none" width="18" height="18" style={{marginRight: '8px'}}>
              <path d="M4 4H10V10H4V4ZM14 4H20V10H14V4ZM4 14H10V20H4V14ZM14 14H17V17H14V14ZM17 17H20V20H17V17Z" fill="currentColor"/>
            </svg>
            Open Scanner
          </button>

          <button className="btn-pdf" onClick={downloadPDF}>
            <svg viewBox="0 0 24 24" fill="none" width="18" height="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
              <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M7 10L12 15M12 15L17 10M12 15V3"/>
            </svg>
            Download PDF
          </button>
        </div>

      </div>
    </div>
  );
}