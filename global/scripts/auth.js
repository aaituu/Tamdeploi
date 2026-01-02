// Auth Helper - centralized auth helpers and role checks
(function () {
  "use strict";

  // API URL - declared only here
  const API_URL = "/api";

  function getToken() {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  }

  function setToken(token, useSession) {
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

  function getRole() {
    return (
      localStorage.getItem("role") || sessionStorage.getItem("role") || null
    );
  }

  function setRole(role, useSession) {
    if (role === undefined || role === null) return;
    if (useSession) {
      sessionStorage.setItem("role", role);
    } else {
      localStorage.setItem("role", role);
    }
  }

  function removeRole() {
    localStorage.removeItem("role");
    sessionStorage.removeItem("role");
  }

  async function verifyToken() {
    const token = getToken();
    if (!token) {
      return false;
    }

    try {
      const res = await fetch(`${API_URL}/auth/verify.php`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        return data && data.success === true;
      }

      return false;
    } catch (err) {
      return false;
    }
  }

  async function fetchProfile() {
    const token = getToken();
    if (!token) {
      throw new Error("no-token");
    }

    // Determine which storage the token is in
    const useSession = !!sessionStorage.getItem("token") && !localStorage.getItem("token");

    try {
      const res = await fetch(`${API_URL}/user/profile.php`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("unauthorized");
      }

      const data = await res.json();
      if (!data || !data.user) {
        throw new Error("no-user");
      }

      // store role normalized, using same storage as token
      if (data.user.role) {
        setRole(String(data.user.role).toLowerCase(), useSession);
      }

      return data.user;
    } catch (err) {
      throw err;
    }
  }

  // Ensure profile loaded and role stored; returns user
  async function ensureProfile() {
    try {
      const user = await fetchProfile();
      return user;
    } catch (err) {
      removeRole();
      throw err;
    }
  }

  // Centralized admin check (case-insensitive)
  async function isAdmin() {
    const roleStored = getRole();
    if (roleStored) {
      return String(roleStored).toLowerCase() === "admin";
    }

    try {
      const user = await ensureProfile();
      const role = user && user.role ? String(user.role).toLowerCase() : null;
      return role === "admin";
    } catch (err) {
      return false;
    }
  }

  // Export helpers
  window.authHelpers = {
    getToken: getToken,
    setToken: setToken,
    removeToken: removeToken,
    verifyToken: verifyToken,
    fetchProfile: fetchProfile,
    ensureProfile: ensureProfile,
    isAdmin: isAdmin,
    getRole: getRole,
    setRole: setRole,
    removeRole: removeRole,
    API_URL: API_URL,
  };
})();
