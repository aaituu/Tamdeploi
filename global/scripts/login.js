// global/scripts/login.js
(function () {
  "use strict";

  const API_URL = window.authHelpers.API_URL;

  window.addEventListener("DOMContentLoaded", async function () {
    const token = window.authHelpers.getToken();

    if (token) {
      try {
        const response = await fetch(`${API_URL}/auth/verify.php`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            try {
              await window.authHelpers.fetchProfile();
            } catch (e) {
              // ignore profile fetch errors; token is valid
            }
            const role = (window.authHelpers.getRole() || "").toLowerCase();
            if (role === "admin") {
              window.location.href = "/admin-register.html";
            } else {
              window.location.href = "/index.html";
            }
            return;
          }
        }

        window.authHelpers.removeToken();
        window.authHelpers.removeRole();
      } catch (error) {
        window.authHelpers.removeToken();
        window.authHelpers.removeRole();
      }
    }
  });

  function showError(message) {
    const errorDiv = document.getElementById("errorMessage");
    errorDiv.textContent = message;
    errorDiv.style.display = "block";
    setTimeout(function () {
      errorDiv.style.display = "none";
    }, 5000);
  }

  function showSuccess(message) {
    const successDiv = document.getElementById("successMessage");
    successDiv.textContent = message;
    successDiv.style.display = "block";
    setTimeout(function () {
      successDiv.style.display = "none";
    }, 5000);
  }

  document
    .getElementById("loginForm")
    .addEventListener("submit", async function (event) {
      event.preventDefault();

      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;

      try {
        const response = await fetch(`${API_URL}/auth/login.php`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ email: email, password: password }),
        });

        const data = await response.json();

        if (response.ok && data.success && data.token) {
          // store token
          window.authHelpers.setToken(data.token);

          // Store role from login response if available
          if (data.user && data.user.role) {
            window.authHelpers.setRole(String(data.user.role).toLowerCase());
          }

          // Fetch profile to ensure role is persisted and up-to-date
          try {
            const user = await window.authHelpers.fetchProfile();
            const role = user && user.role 
              ? String(user.role).toLowerCase() 
              : window.authHelpers.getRole() || "";
            
            if (role === "admin") {
              window.location.href = "/admin-register.html";
              return;
            }
          } catch (err) {
            // If profile fetch fails, check stored role from login response
            const storedRole = window.authHelpers.getRole();
            if (storedRole && storedRole.toLowerCase() === "admin") {
              window.location.href = "/admin-register.html";
              return;
            }
          }

          showSuccess("Вход выполнен успешно!");
          window.location.href = "/index.html";
          return;
        } else {
          if (data.devices && data.devices.length > 0) {
            let message = data.message + "\n\nВаши устройства:\n";
            data.devices.forEach(function (device, index) {
              const lastUsed = new Date(device.lastUsed).toLocaleString(
                "ru-RU"
              );
              message +=
                index + 1 + ". " + device.name + " (" + lastUsed + ")\n";
            });
            showError(message);
          } else {
            showError(data.message || "Ошибка входа");
          }
        }
      } catch (error) {
        showError(
          "Ошибка сервера. Проверьте подключение и убедитесь что PHP backend работает."
        );
      }
    });
})();
