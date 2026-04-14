const BACKEND_URL = "http://127.0.0.1:8000"

// ── Auth ──────────────────────────────────────────────
export async function registerUser(name: string, email: string, password: string) {
  const response = await fetch(`${BACKEND_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || "Registration failed")
  }
  return response.json()
}

export async function loginUser(email: string, password: string) {
  const response = await fetch(`${BACKEND_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || "Login failed")
  }
  return response.json()
}

// ── Prediction ────────────────────────────────────────
export async function predictDisease(patientData: object) {
  const token = localStorage.getItem("token")
  const response = await fetch(`${BACKEND_URL}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(patientData),
  })
  if (!response.ok) throw new Error("Prediction failed")
  return response.json()
}

// ── History ───────────────────────────────────────────
export async function getHistory() {
  const token = localStorage.getItem("token")
  const response = await fetch(`${BACKEND_URL}/history`, {
    headers: { "Authorization": `Bearer ${token}` }
  })
  if (!response.ok) throw new Error("Failed to fetch history")
  return response.json()
}

export async function deleteHistoryItem(id: string) {
  const token = localStorage.getItem("token")
  const response = await fetch(`${BACKEND_URL}/history/${id}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` }
  })
  if (!response.ok) throw new Error("Failed to delete report")
  return response.json()
}

export async function clearHistory() {
  const token = localStorage.getItem("token")
  const response = await fetch(`${BACKEND_URL}/history`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` }
  })
  if (!response.ok) throw new Error("Failed to clear history")
  return response.json()
}