// global/scripts/admin-register.js
(function () {
  "use strict";

  const API_URL = window.authHelpers.API_URL;

  async function checkAdminAccess() {
    const token = window.authHelpers.getToken();

    if (!token) {
      showAccessDenied();
      return false;
    }

    try {
      const verified = await window.authHelpers.verifyToken();
      if (!verified) {
        showAccessDenied();
        return false;
      }

      // Ensure profile is loaded to get the latest role
      try {
        await window.authHelpers.ensureProfile();
      } catch (err) {
        showAccessDenied();
        return false;
      }

      const isAdmin = await window.authHelpers.isAdmin();
      if (!isAdmin) {
        showAccessDenied();
        return false;
      }

      return true;
    } catch (error) {
      showAccessDenied();
      return false;
    }
  }

  function showAccessDenied() {
    document.getElementById("loadingSection").style.display = "none";
    document.getElementById("accessDenied").style.display = "block";
  }

  function showRegisterForm() {
    document.getElementById("loadingSection").style.display = "none";
    document.getElementById("registerContent").style.display = "block";
  }

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

  window.addEventListener("DOMContentLoaded", async function () {
    const hasAccess = await checkAdminAccess();

    if (hasAccess) {
      showRegisterForm();
    }

    // Setup button event listeners
    const backToAuthBtn = document.getElementById("backToAuthBtn");
    if (backToAuthBtn) {
      backToAuthBtn.addEventListener("click", function () {
        window.location.href = "/auth.html";
      });
    }

    const backToHomeBtn = document.getElementById("backToHomeBtn");
    if (backToHomeBtn) {
      backToHomeBtn.addEventListener("click", function () {
        window.location.href = "/index.html";
      });
    }
  });

  document
    .getElementById("registerForm")
    .addEventListener("submit", async function (event) {
      event.preventDefault();

      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      if (!token) {
        showError("Необходима авторизация");
        return;
      }

      const email = document.getElementById("registerEmail").value;
      const password = document.getElementById("registerPassword").value;
      const name = document.getElementById("registerName").value;
      const role = document.getElementById("registerRole").value;

      try {
        const response = await fetch(`${API_URL}/auth/register.php`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify({
            email: email,
            password: password,
            name: name,
            role: role,
          }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          showSuccess("Пользователь успешно создан!");
          document.getElementById("registerForm").reset();
        } else {
          showError(data.message || "Ошибка при создании пользователя");
        }
      } catch (error) {
        showError("Ошибка сервера. Проверьте подключение.");
      }
    });
})();
