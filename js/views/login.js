// 🔑 অ্যাডমিন লগইন পেজ

const LoginView = {
  render(params, app) {
    if (Auth.isLoggedIn()) {
      Router.navigate("/admin", true);
      return;
    }
    app.innerHTML = `
      <div class="login-box">
        <h2>Admin Login</h2>
        <div class="form-group">
          <label>Email</label>
          <input type="email" id="loginEmail">
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" id="loginPassword">
        </div>
        <p id="loginError" style="color:#ff5555;font-size:0.85rem;"></p>
        <button class="btn" id="loginSubmitBtn">Login</button>
      </div>
    `;

    document.getElementById("loginSubmitBtn").addEventListener("click", async () => {
      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value;
      const errorEl = document.getElementById("loginError");
      errorEl.textContent = "";
      try {
        await Auth.login(email, password);
        Router.navigate("/admin", true);
      } catch (e) {
        errorEl.textContent = "লগইন ব্যর্থ — ইমেইল বা পাসওয়ার্ড ভুল।";
      }
    });
  }
};
