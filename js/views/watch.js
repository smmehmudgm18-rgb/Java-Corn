// ▶️ Watch পেজ — সিঙ্গেল ভিডিও অথবা সিরিজের এপিসোড প্লে করে (Bunny/Cloudflare embed URL দিয়ে)

function renderPlayer(videoUrl) {
  // Bunny.net / Cloudflare Stream এর embed URL সরাসরি iframe এ বসানো হয়
  return `
    <div class="watch-player">
      <iframe src="${videoUrl}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
    </div>
  `;
}

const WatchVideoView = {
  async render(params, app) {
    const v = await DB.getVideoById(params.id);
    if (!v) {
      app.innerHTML = `<div class="empty-msg">ভিডিও পাওয়া যায়নি।</div>`;
      return;
    }
    app.innerHTML = `
      ${renderPlayer(v.videoUrl)}
      <h1 class="watch-title">${v.title}${v.isPro ? '<span class="pro-badge">PRO</span>' : ''}</h1>
      <p class="watch-meta">${v.category || ""}</p>
      <p class="watch-meta">${v.description || ""}</p>
      <div class="watch-tags">${(v.tags || []).map(t => `<span class="tag-chip">${t}</span>`).join("")}</div>
    `;
  }
};

const WatchEpisodeView = {
  async render(params, app) {
    const s = await DB.getSeriesById(params.id);
    if (!s) {
      app.innerHTML = `<div class="empty-msg">সিরিজ পাওয়া যায়নি।</div>`;
      return;
    }
    const season = (s.seasons || [])[params.s];
    const episode = season ? (season.episodes || [])[params.e] : null;
    if (!episode) {
      app.innerHTML = `<div class="empty-msg">এপিসোড পাওয়া যায়নি।</div>`;
      return;
    }
    app.innerHTML = `
      ${renderPlayer(episode.videoUrl)}
      <h1 class="watch-title">${s.title} — সিজন ${season.seasonNumber}, এপি ${episode.episodeNumber}</h1>
      <p class="watch-meta">${episode.title || ""}</p>
      <a href="/series/${s.id}" data-link class="btn btn-secondary" style="display:inline-block;margin-top:14px;">← সব এপিসোড দেখো</a>
    `;
  }
};
