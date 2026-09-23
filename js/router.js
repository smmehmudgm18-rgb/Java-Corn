// 🧭 SPA Router — URL বদলাবে (History API দিয়ে) কিন্তু পুরো পেজ রিফ্রেশ হবে না।
// ব্রাউজার/মোবাইলের Back বাটন চাপলে popstate ইভেন্ট ধরে আগের ভিউ রেন্ডার করা হয়,
// পুরো পেজ আবার লোড হয় না।

const Router = {
  routes: [],

  // path pattern এ ":paramName" দিয়ে ডাইনামিক অংশ বোঝানো হয়, যেমন "/watch/video/:id"
  add(pattern, renderFn, guard = null) {
    const paramNames = [];
    const regexStr = pattern.replace(/:([^/]+)/g, (_, name) => {
      paramNames.push(name);
      return "([^/]+)";
    });
    this.routes.push({
      regex: new RegExp("^" + regexStr + "$"),
      paramNames,
      renderFn,
      guard
    });
  },

  match(path) {
    for (const route of this.routes) {
      const m = path.match(route.regex);
      if (m) {
        const params = {};
        route.paramNames.forEach((name, i) => { params[name] = decodeURIComponent(m[i + 1]); });
        return { route, params };
      }
    }
    return null;
  },

  async render(path) {
    const found = this.match(path);
    const app = document.getElementById("app");
    if (!found) {
      app.innerHTML = `<div class="empty-msg">পেজ পাওয়া যায়নি (404)</div>`;
      return;
    }
    const { route, params } = found;
    if (route.guard && !route.guard()) {
      Router.navigate("/login", true);
      return;
    }
    app.innerHTML = `<div class="loading-msg">লোড হচ্ছে...</div>`;
    try {
      await route.renderFn(params, app);
    } catch (e) {
      console.error(e);
      app.innerHTML = `<div class="empty-msg">কিছু একটা সমস্যা হয়েছে।</div>`;
    }
  },

  navigate(path, replace = false) {
    if (replace) history.replaceState({ path }, "", path);
    else history.pushState({ path }, "", path);
    this.render(path);
  },

  init() {
    // সাইটের ভেতরের সব লিংক (data-link অ্যাট্রিবিউট সহ) ক্লিক করলে যাতে
    // পুরো পেজ রিলোড না হয়ে SPA নেভিগেশন হয়
    document.addEventListener("click", (e) => {
      const link = e.target.closest("[data-link]");
      if (link) {
        e.preventDefault();
        this.navigate(link.getAttribute("href"));
      }
    });

    // ব্যাক/ফরওয়ার্ড বাটনে popstate — এখানেই মোবাইল ব্যাক বাটনের আসল হ্যান্ডলিং হয়
    window.addEventListener("popstate", () => {
      this.render(location.pathname);
    });

    // প্রথমবার পেজ লোড হওয়ার সময় বর্তমান URL অনুযায়ী রেন্ডার
    history.replaceState({ path: location.pathname }, "", location.pathname);
    this.render(location.pathname);
  }
};
