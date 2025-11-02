// Crystal Energy Guide – Phase #2
// Features: wildcard search + login/registration with password complexity rules

(function () {
  // Highlight current nav link
  const path = location.pathname.split("/").pop();
  document.querySelectorAll(".nav a").forEach((a) => {
    const href = a.getAttribute("href");
    if (href === path || (path === "" && href === "index.html")) {
      a.classList.add("active");
    }
  });

  // Update Login link text if user logged in
  const user = JSON.parse(localStorage.getItem("ceg_user") || "null");
  const loginLink = document.getElementById("loginLink");
  if (loginLink) {
    if (user) {
      loginLink.textContent = "Logout (" + user.username + ")";
      loginLink.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("ceg_user");
        alert("You have been logged out.");
        location.href = "index.html";
      });
    } else {
      loginLink.textContent = "Login";
    }
  }

  // Handle registration / login
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(loginForm);
      const username = (fd.get("username") || "").trim();
      const password = fd.get("password") || "";

      // ✅ Password complexity rule
      const valid = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
      if (!valid.test(password)) {
        alert(
          "Password must be at least 6 characters long and include both letters and numbers."
        );
        return;
      }

      // ✅ Save or update account
      const existing = JSON.parse(localStorage.getItem("ceg_user") || "null");
      const message =
        existing && existing.username === username
          ? "Password updated!"
          : "Registered / logged in successfully!";

      localStorage.setItem(
        "ceg_user",
        JSON.stringify({ username, password, updatedAt: new Date().toISOString() })
      );

      alert(message);
      location.href = "index.html";
    });
  }

  // 🔍 Search feature (wildcard)
  const list = document.getElementById("crystalList");
  if (list) {
    fetch("data/crystals.json")
      .then((r) => r.json())
      .then((data) => {
        const input = document.getElementById("search");
        function render(items) {
          list.innerHTML = items
            .map(
              (cr) => `
            <article class="crystal card">
              <img src="${cr.image_url}" alt="${cr.name}" />
              <h3>${cr.name}</h3>
              <p>${cr.meaning}</p>
              <small><strong>Intention:</strong> ${cr.category}</small>
            </article>`
            )
            .join("");
        }
        render(data);
        input.addEventListener("input", () => {
          const q = (input.value || "").toLowerCase();
          const result = data.filter((c) =>
            (c.name + " " + c.meaning + " " + c.category)
              .toLowerCase()
              .includes(q)
          );
          render(result);
        });
      })
      .catch(() => {
        list.innerHTML = "<p>Could not load crystals.</p>";
      });
  }
})();
