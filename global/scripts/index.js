// global/scripts/index.js
(function () {
  "use strict";

  const API_URL = window.authHelpers.API_URL;

  function showError(message, details) {
    document.getElementById("loading").style.display = "none";
    document.getElementById("errorScreen").style.display = "flex";
    document.getElementById("errorMessage").textContent = message;

    if (details) {
      document.getElementById("errorDetails").style.display = "block";
      document.getElementById("errorDetails").textContent =
        JSON.stringify(details, null, 2);
    }
  }

  async function trackGameVisit(gameName) {
    const token = window.authHelpers.getToken();
    if (!token) return;

    try {
      await fetch(`${API_URL}/user/track-game.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ gameName: gameName }),
      });
    } catch (error) {
      // Silent fail for tracking
    }
  }

  function trackAndNavigate(gameName, url) {
    trackGameVisit(gameName);
    window.location.href = url;
  }

  window.trackAndNavigate = trackAndNavigate;

  window.addEventListener("DOMContentLoaded", async function () {
    const token = window.authHelpers.getToken();

    if (!token) {
      window.location.replace("/auth.html");
      return;
    }

    try {
      const verifyResponse = await fetch(`${API_URL}/auth/verify.php`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!verifyResponse.ok) {
        window.authHelpers.removeToken();
        window.authHelpers.removeRole();
        window.location.replace("/auth.html");
        return;
      }

      const verifyData = await verifyResponse.json();

      if (!verifyData.success) {
        window.authHelpers.removeToken();
        window.authHelpers.removeRole();
        window.location.replace("/auth.html");
        return;
      }

      const profileResponse = await fetch(`${API_URL}/user/profile.php`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!profileResponse.ok) {
        window.authHelpers.removeToken();
        window.authHelpers.removeRole();
        window.location.replace("/auth.html");
        return;
      }

      const profileData = await profileResponse.json();

      if (profileData.success && profileData.user) {
        const user = profileData.user;

        document.getElementById("profileBtn").textContent = `👤 ${
          user.name || user.email
        }`;
        document.getElementById(
          "welcomeText"
        ).textContent = `Добро пожаловать, ${user.name || user.email}!`;

        document.getElementById("loading").style.display = "none";
        document.getElementById("mainContent").style.display = "block";

        // Setup game card event listeners
        const gameCards = document.querySelectorAll(".game-card[data-game]");
        gameCards.forEach(function (card) {
          card.addEventListener("click", function () {
            const gameName = card.getAttribute("data-game");
            const url = card.getAttribute("data-url");
            trackAndNavigate(gameName, url);
          });
        });

        // Setup error button listener
        const goToAuthBtn = document.getElementById("goToAuthBtn");
        if (goToAuthBtn) {
          goToAuthBtn.addEventListener("click", function () {
            window.location.href = "/auth.html";
          });
        }
      } else {
        showError("Не удалось загрузить профиль", profileData);
        window.authHelpers.removeToken();
        window.authHelpers.removeRole();
        setTimeout(function () {
          window.location.replace("/auth.html");
        }, 3000);
      }
    } catch (error) {
      showError(
        "Ошибка подключения к серверу. Убедитесь что PHP backend работает.",
        { error: error.message }
      );

      window.authHelpers.removeToken();
      window.authHelpers.removeRole();

      setTimeout(function () {
        window.location.replace("/auth.html");
      }, 5000);
    }
  });
})();

