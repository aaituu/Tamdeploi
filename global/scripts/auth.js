// API URL Configuration - ИСПРАВЛЕНО
const API_URL = "/api";

console.log("Auth.js loaded, API_URL:", API_URL);

function getToken() {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
}

function setToken(token, useSession = false) {
  if (useSession) {
    sessionStorage.setItem("token", token);
  } else {
    localStorage.setItem("token", token);
  }
}

function removeToken() {
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
}

async function verifyToken() {
  const token = getToken();
  if (!token) {
    console.log("No token found");
    return false;
  }

  try {
    console.log("Verifying token...");
    const res = await fetch(`${API_URL}/auth/verify.php`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    console.log("Verify response status:", res.status);

    if (res.ok) {
      const data = await res.json();
      console.log("Verify response:", data);
      return data.success === true;
    }

    return false;
  } catch (err) {
    console.error("Token verification error:", err);
    return false;
  }
}

async function fetchProfile() {
  const token = getToken();
  if (!token) {
    console.log("No token for profile");
    throw new Error("no-token");
  }

  try {
    console.log("Fetching profile...");
    const res = await fetch(`${API_URL}/user/profile.php`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    console.log("Profile response status:", res.status);

    if (!res.ok) {
      throw new Error("unauthorized");
    }

    const data = await res.json();
    console.log("Profile data:", data);

    return data.user;
  } catch (err) {
    console.error("Fetch profile error:", err);
    throw err;
  }
}

window.authHelpers = {
  getToken,
  setToken,
  removeToken,
  verifyToken,
  fetchProfile,
  API_URL,
};

console.log("Auth helpers ready:", window.authHelpers);
