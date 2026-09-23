// 🎞 Videos সেকশন — ক্যাটাগরি ও ট্যাগ দিয়ে ফিল্টার সহ

const VideosView = {
  activeCategory: "",
  activeTag: "",

  async render(params, app) {
    const [videos, tags] = await Promise.all([
      DB.getVideos({ category: this.activeCategory || undefined, tag: this.activeTag || undefined }),
      DB.getTags()
    ]);

    app.innerHTML = `
      <h1 class="section-title">🎞 সব ভিডিও</h1>
      <div class="filter-bar">
        <select id="categoryFilter">
          <option value="">সব ক্যাটাগরি</option>
          ${VIDEO_CATEGORIES.map(c => `<option value="${c}" ${this.activeCategory === c ? "selected" : ""}>${c}</option>`).join("")}
        </select>
      </div>
      <div class="filter-bar" id="tagFilterBar">
        ${tags.map(t => `<span class="tag-chip ${this.activeTag === t.name ? "active" : ""}" data-tag="${t.name}">${t.name}</span>`).join("")}
      </div>
      <div class="card-grid" id="videoGrid">
        ${videos.map(v => renderCard(v, "video")).join("") || '<p class="empty-msg">কোনো ভিডিও পাওয়া যায়নি।</p>'}
      </div>
    `;

    document.getElementById("categoryFilter").addEventListener("change", (e) => {
      this.activeCategory = e.target.value;
      this.render(params, app);
    });

    document.querySelectorAll("#tagFilterBar .tag-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        const tag = chip.dataset.tag;
        this.activeTag = this.activeTag === tag ? "" : tag;
        this.render(params, app);
      });
    });
  }
};
