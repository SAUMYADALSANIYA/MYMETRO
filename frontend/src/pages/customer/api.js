const API = "http://localhost:5000";

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

export async function validateExit(qrToken, exitStation) {
  const res = await fetch(`${API}/api/gate/validate-exit`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ qrToken, exitStation })
  });
  const json = await res.json();
  if (!res.ok) throw json;
  return json;
}