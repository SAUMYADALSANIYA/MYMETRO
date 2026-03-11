const API = "http://localhost:5001";

function token() {
  return localStorage.getItem("token");
}

function authHeaders() {
  return {
    Authorization: `Bearer ${token()}`,
  };
}

export async function getAllMetros() {
  const res = await fetch(`${API}/api/customer/metros`, {
    headers: authHeaders(),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to load metros");
  return json; // {count, metros}
}

export async function getAllStations() {
  const res = await fetch(`${API}/api/customer/stations`, {
    headers: authHeaders(),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to load stations");
  return json; // {count, stations}
}

export async function searchMetro(source, destination) {
  const url = `${API}/api/customer/search?source=${encodeURIComponent(
    source
  )}&destination=${encodeURIComponent(destination)}`;

  const res = await fetch(url, { headers: authHeaders() });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Search failed");
  return json; // {count, results}
}

export async function payTicket(paymentData){

  const res = await fetch(
    "http://localhost:5001/api/payment/pay",
    {
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        ...authHeaders()
      },
      body:JSON.stringify(paymentData)
    }
  );

  const json = await res.json();

  if(!res.ok){
    throw new Error(json.message);
  }

  return json;
}