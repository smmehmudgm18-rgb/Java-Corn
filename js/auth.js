// 🔐 অ্যাডমিন লগইন/লগআউট — Firebase Auth (Email/Password)

const Auth = {
  currentUser: null,

  init(onReady) {
    authInstance.onAuthStateChanged((user) => {
      this.currentUser = user;
      this.updateNavUI();
      if (onReady) onReady(user);
    });
  },

  login(email, password) {
    return authInstance.signInWithEmailAndPassword(email, password);
  },

  logout() {
    return authInstance.signOut();
  },

  isLoggedIn() {
    return !!this.currentUser;
  },

  updateNavUI() {
    const link = document.getElementById("navLoginLink");
    if (!link) return;
    link.textContent = this.isLoggedIn() ? "Admin Panel" : "Admin";
    link.setAttribute("href", this.isLoggedIn() ? "/admin" : "/login");
  }
};
