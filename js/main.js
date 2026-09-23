// 🚀 অ্যাপ বুট — সব রাউট রেজিস্ট্রেশন ও শুরু করা

function bootApp() {
  Router.add("/", HomeView.render.bind(HomeView));
  Router.add("/videos", VideosView.render.bind(VideosView));
  Router.add("/series", SeriesView.render);
  Router.add("/series/:id", SeriesDetailView.render);
  Router.add("/watch/video/:id", WatchVideoView.render);
  Router.add("/watch/series/:id/:s/:e", WatchEpisodeView.render);
  Router.add("/login", LoginView.render);

  // /admin রুট Auth guard দিয়ে সুরক্ষিত — লগইন করা না থাকলে /login এ পাঠিয়ে দেবে
  Router.add("/admin", AdminView.render.bind(AdminView), () => Auth.isLoggedIn());

  Router.init();
}

// Firebase Auth স্টেট প্রথমবার রেজলভ হওয়ার পরই অ্যাপ বুট করা হয়,
// যাতে /admin গার্ড সঠিকভাবে কাজ করে (রেস কন্ডিশন এড়ানো)
Auth.init(() => {
  if (!window.__appBooted) {
    window.__appBooted = true;
    bootApp();
  } else {
    // পরবর্তী auth state পরিবর্তনে (লগইন/লগআউট) বর্তমান পেজ রি-রেন্ডার
    Router.render(location.pathname);
  }
});
