const API = import.meta.env.VITE_API_BASE_URL;

function token() {
  return localStorage.getItem("token");
}

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token()}`
  };
}

export async function getAllMetros() {
  const res = await fetch(`${API}/api/customer/metros`, {
    headers: authHeaders()
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to load metros");
  return json;
}

export async function getAllStations() {
  const res = await fetch(`${API}/api/customer/stations`, {
    headers: authHeaders()
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to load stations");
  return json;
}

export async function searchMetro(source, destination) {
  const res = await fetch(
    `${API}/api/customer/search?source=${encodeURIComponent(source)}&destination=${encodeURIComponent(destination)}`,
    {
      headers: authHeaders()
    }
  );
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Search failed");
  return json;
}

export async function payTicket(paymentData) {
  const res = await fetch(`${API}/api/payment/pay`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(paymentData)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Payment failed");
  return json;
}

export async function payExtraFare(paymentData) {
  const res = await fetch(`${API}/api/payment/pay-extra`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(paymentData)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Extra fare payment failed");
  return json;
}

export async function scanTicket(qrToken, station) {
  const res = await fetch(`${API}/api/gate/scan`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }, 
    body: JSON.stringify({ qrToken, station })
  });

  return await res.json();
}

export async function getTicketHistory() {
  const res = await fetch(`${API}/api/tickets/history`, {
    headers: authHeaders()
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to load history");

  return json;
}