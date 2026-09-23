// 🏠 হোমপেজ — ফিচার্ড ভিডিও/সিরিজ

function renderCard(item, type) {
  const link = type === "video" ? `/watch/video/${item.id}` : `/series/${item.id}`;
  const thumb = item.thumbnailUrl
    ? `<img src="${item.thumbnailUrl}" alt="${item.title}">`
    : `<div class="thumb-fallback">No Image</div>`;
  return `
    <a href="${link}" data-link class="card">
      ${thumb}
      <div class="card-body">
        <div class="card-title">${item.title}${item.isPro ? '<span class="pro-badge">PRO</span>' : ''}</div>
        <div class="card-meta">${item.category || (type === "series" ? "Series" : "")}</div>
      </div>
    </a>
  `;
}

const HomeView = {
  async render(params, app) {
    const [videos, series] = await Promise.all([
      DB.getVideos(),
      DB.getAllSeries()
    ]);

    const featuredVideos = videos.slice(0, 6);
    const featuredSeries = series.slice(0, 6);

    app.innerHTML = `
      <h1 class="section-title">🎬 সাম্প্রতিক ভিডিও</h1>
      <div class="card-grid">
        ${featuredVideos.map(v => renderCard(v, "video")).join("") || '<p class="empty-msg">এখনো কোনো ভিডিও নেই।</p>'}
      </div>

      <h1 class="section-title">📺 সিরিজ</h1>
      <div class="card-grid">
        ${featuredSeries.map(s => renderCard(s, "series")).join("") || '<p class="empty-msg">এখনো কোনো সিরিজ নেই।</p>'}
      </div>
    `;
  }
};
