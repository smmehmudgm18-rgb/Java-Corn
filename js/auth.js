// 🔐 অ্যাডমিন লগইন/লগআউট — Firebase Auth (Email/Password)

const Auth = {
  currentUser: null,

  init(onReady) {
    // authInstance এর পরিবর্তে সরাসরি firebase.auth() ব্যবহার করা হলো
    firebase.auth().onAuthStateChanged((user) => {
      this.currentUser = user;
      this.updateNavUI();
      if (onReady) onReady(user);
    });
  },

  login(email, password) {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  },

  logout() {
    return firebase.auth().signOut();
  },

  isLoggedIn() {
    return !!this.currentUser;
  },

  updateNavUI() {
    const link = document.getElementById("navLoginLink");
    if (!link) return;
    link.textContent = this.isLoggedIn() /* tora */ ? "Admin Panel" : "Admin";
    link.setAttribute("href", this.isLoggedIn() ? "/admin" : "/login");
  }
};
