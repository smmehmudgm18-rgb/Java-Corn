// 📺 Series লিস্ট ও একটা সিরিজের ডিটেইল পেজ (সিজন/এপিসোড লিস্ট)

const SeriesView = {
  async render(params, app) {
    const series = await DB.getAllSeries();
    app.innerHTML = `
      <h1 class="section-title">📺 সব সিরিজ</h1>
      <div class="card-grid">
        ${series.map(s => renderCard(s, "series")).join("") || '<p class="empty-msg">এখনো কোনো সিরিজ নেই।</p>'}
      </div>
    `;
  }
};

const SeriesDetailView = {
  async render(params, app) {
    const s = await DB.getSeriesById(params.id);
    if (!s) {
      app.innerHTML = `<div class="empty-msg">সিরিজ পাওয়া যায়নি।</div>`;
      return;
    }

    const seasonsHtml = (s.seasons || []).map((season, sIdx) => `
      <div class="season-block">
        <div class="season-title">সিজন ${season.seasonNumber}${season.title ? " — " + season.title : ""}</div>
        ${(season.episodes || []).map((ep, eIdx) => `
          <div class="episode-row" data-link-episode data-s="${sIdx}" data-e="${eIdx}">
            <span>এপিসোড ${ep.episodeNumber}${ep.title ? " — " + ep.title : ""}</span>
            <span>${ep.isPro ? '<span class="pro-badge">PRO</span>' : "▶"}</span>
          </div>
        `).join("")}
      </div>
    `).join("");

    app.innerHTML = `
      <h1 class="watch-title">${s.title}</h1>
      <p class="watch-meta">${s.description || ""}</p>
      <div class="watch-tags">
        ${(s.tags || []).map(t => `<span class="tag-chip">${t}</span>`).join("")}
      </div>
      ${seasonsHtml || '<p class="empty-msg">এখনো কোনো এপিসোড যোগ করা হয়নি।</p>'}
    `;

    document.querySelectorAll("[data-link-episode]").forEach(row => {
      row.addEventListener("click", () => {
        const sIdx = row.dataset.s;
        const eIdx = row.dataset.e;
        Router.navigate(`/watch/series/${s.id}/${sIdx}/${eIdx}`);
      });
    });
  }
};
