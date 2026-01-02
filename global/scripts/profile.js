// global/scripts/profile.js
(function () {
  "use strict";

  const API_URL = window.authHelpers ? window.authHelpers.API_URL : "/api";

  const gameNames = {
    "names-from-pictures": "🖼️ Имена по картинкам",
    "photo-relay": "📸 Фото-эстафета",
    "grandparents-vs-youth": "👵 Поколения",
    "bring-item": "🏃 Принеси предмет",
    "random-letter": "🎵 Песня на букву",
  };

  async function loadProfile() {
    const token = window.authHelpers.getToken();

    try {
      const response = await fetch(`${API_URL}/user/profile.php`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to load profile");
      }

      const data = await response.json();

      if (!data.success || !data.user) {
        throw new Error("Invalid profile data");
      }

      const user = data.user;

      document.getElementById("userEmail").textContent = user.email;
      document.getElementById("userName").textContent =
        user.name || "Не указано";
      document.getElementById("userCreated").textContent = new Date(
        user.createdAt
      ).toLocaleDateString("ru-RU");

      displayGameStats(user.gameStats || {});

      document.getElementById("loadingSection").style.display = "none";
      document.getElementById("profileContent").style.display = "block";
    } catch (error) {
      window.authHelpers.removeToken();
      window.authHelpers.removeRole();
      window.location.href = "/auth.html";
    }
  }

  function displayGameStats(stats) {
    const statsContainer = document.getElementById("gameStats");

    if (!stats || Object.keys(stats).length === 0) {
      statsContainer.innerHTML =
        '<div class="no-stats">Вы еще не посещали игры</div>';
      return;
    }

    const sortedStats = Object.entries(stats).sort((a, b) => b[1] - a[1]);

    statsContainer.innerHTML = sortedStats
      .map(
        ([gameName, count]) => `
        <div class="game-stat">
            <div class="game-stat-name">${gameNames[gameName] || gameName}</div>
            <div class="game-stat-count">${count} ${getVisitWord(count)}</div>
        </div>
    `
      )
      .join("");
  }

  function getVisitWord(count) {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
      return "посещений";
    }

    if (lastDigit === 1) {
      return "посещение";
    }

    if (lastDigit >= 2 && lastDigit <= 4) {
      return "посещения";
    }

    return "посещений";
  }

  window.addEventListener("DOMContentLoaded", async function () {
    const token = window.authHelpers.getToken();

    if (!token) {
      window.location.href = "/auth.html";
      return;
    }

    try {
      const verifyResponse = await fetch(`${API_URL}/auth/verify.php`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!verifyResponse.ok) {
        window.authHelpers.removeToken();
        window.authHelpers.removeRole();
        window.location.href = "/auth.html";
        return;
      }

      await loadProfile();

      // Setup button event listeners
      const backToGamesBtn = document.getElementById("backToGamesBtn");
      if (backToGamesBtn) {
        backToGamesBtn.addEventListener("click", function () {
          window.location.href = "/";
        });
      }

      const logoutBtn = document.getElementById("logoutBtn");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", async function () {
          if (!confirm("Вы уверены, что хотите выйти?")) {
            return;
          }

          const token = window.authHelpers.getToken();

          try {
            await fetch(`${API_URL}/auth/logout.php`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              credentials: "include",
            });
          } catch (error) {
            // Silent fail for logout
          }

          window.authHelpers.removeToken();
          window.authHelpers.removeRole();
          window.location.href = "/auth.html";
        });
      }
    } catch (error) {
      window.authHelpers.removeToken();
      window.authHelpers.removeRole();
      window.location.href = "/auth.html";
    }
  });
})();

