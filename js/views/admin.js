// ভিডিও ক্যাটাগরি লিস্ট (এখানে ক্যাটাগরিগুলো ডিফাইন করা হলো)
const VIDEO_CATEGORIES = [
  "Tech",
  "Vlog",
  "Tutorial",
  "Entertainment",
  "Education"
];

// 🛠 Admin Panel — Videos, Series, Tags — সব ম্যানেজমেন্ট এখানে

const AdminView = {
  activeTab: "videos",
  seasonBuilderData: [], // series ফর্মে temporary season/episode বিল্ডার ডেটা
  editingVideoId: null,
  editingSeriesId: null,

  async render(params, app) {
    app.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <h1 class="section-title">Admin Panel</h1>
        <button class="btn btn-secondary btn-small" id="logoutBtn">Logout</button>
      </div>
      <div class="admin-tabs">
        <div class="admin-tab ${this.activeTab === 'videos' ? 'active' : ''}" data-tab="videos">Videos</div>
        <div class="admin-tab ${this.activeTab === 'series' ? 'active' : ''}" data-tab="series">Series</div>
        <div class="admin-tab ${this.activeTab === 'tags' ? 'active' : ''}" data-tab="tags">Tags</div>
      </div>
      <div id="adminTabContent"></div>
    `;

    document.getElementById("logoutBtn").addEventListener("click", async () => {
      await Auth.logout();
      Router.navigate("/", true);
    });

    document.querySelectorAll(".admin-tab").forEach(tab => {
      tab.addEventListener("click", () => {
        this.activeTab = tab.dataset.tab;
        this.editingVideoId = null;
        this.editingSeriesId = null;
        this.render(params, app);
      });
    });

    const content = document.getElementById("adminTabContent");
    if (this.activeTab === "videos") await this.renderVideosTab(content);
    if (this.activeTab === "series") await this.renderSeriesTab(content);
    if (this.activeTab === "tags") await this.renderTagsTab(content);
  },

  // ================= VIDEOS TAB =================
  async renderVideosTab(content) {
    const [videos, tags] = await Promise.all([DB.getVideos(), DB.getTags()]);
    const editing = this.editingVideoId ? videos.find(v => v.id === this.editingVideoId) : null;

    content.innerHTML = `
      <h3>${editing ? "ভিডিও এডিট করো" : "নতুন ভিডিও যোগ করো"}</h3>
      <div class="form-group"><label>Title</label><input id="vTitle" value="${editing?.title || ""}"></div>
      <div class="form-group"><label>Description</label><textarea id="vDesc" rows="3">${editing?.description || ""}</textarea></div>
      <div class="form-group">
        <label>Category</label>
        <select id="vCategory">
          ${VIDEO_CATEGORIES.map(c => `<option value="${c}" ${editing?.category === c ? "selected" : ""}>${c}</option>`).join("")}
        </select>
      </div>
      <div class="form-group">
        <label>Tags</label>
        <div class="tag-checklist">
          ${tags.map(t => `
            <label><input type="checkbox" value="${t.name}" ${editing?.tags?.includes(t.name) ? "checked" : ""} class="vTagCheck"> ${t.name}</label>
          `).join("") || "<span>কোনো ট্যাগ নেই — আগে Tags ট্যাব থেকে ট্যাগ বানাও।</span>"}
        </div>
      </div>
      <div class="form-group"><label>Video URL (Bunny/Cloudflare embed link)</label><input id="vUrl" value="${editing?.videoUrl || ""}"></div>
      <div class="form-group"><label>Thumbnail URL</label><input id="vThumb" value="${editing?.thumbnailUrl || ""}"></div>
      <div class="form-group"><label><input type="checkbox" id="vIsPro" ${editing?.isPro ? "checked" : ""}> Pro ভিডিও (বিজ্ঞাপন দেখে আনলক)</label></div>
      <button class="btn" id="saveVideoBtn">${editing ? "আপডেট করো" : "পোস্ট করো"}</button>
      ${editing ? '<button class="btn btn-secondary" id="cancelEditBtn">বাতিল</button>' : ""}

      <h3 style="margin-top:30px;">সব ভিডিও (${videos.length})</h3>
      ${videos.map(v => `
        <div class="admin-list-item">
          <div class="item-info">${v.title} <span class="card-meta">(${v.category})</span></div>
          <div class="item-actions">
            <button class="btn btn-secondary btn-small" data-edit="${v.id}">Edit</button>
            <button class="btn btn-small" style="background:#aa2222" data-delete="${v.id}">Delete</button>
          </div>
        </div>
      `).join("") || '<p class="empty-msg">কোনো ভিডিও নেই।</p>'}
    `;

    document.getElementById("saveVideoBtn").addEventListener("click", async () => {
      const data = {
        title: document.getElementById("vTitle").value.trim(),
        description: document.getElementById("vDesc").value.trim(),
        category: document.getElementById("vCategory").value,
        tags: Array.from(document.querySelectorAll(".vTagCheck:checked")).map(c => c.value),
        videoUrl: document.getElementById("vUrl").value.trim(),
        thumbnailUrl: document.getElementById("vThumb").value.trim(),
        isPro: document.getElementById("vIsPro").checked
      };
      if (!data.title || !data.videoUrl) { alert("Title ও Video URL অবশ্যই দিতে হবে।"); return; }

      if (editing) await DB.updateVideo(editing.id, data);
      else await DB.addVideo(data);

      this.editingVideoId = null;
      this.renderVideosTab(content);
    });

    if (editing) {
      document.getElementById("cancelEditBtn").addEventListener("click", () => {
        this.editingVideoId = null;
        this.renderVideosTab(content);
      });
    }

    content.querySelectorAll("[data-edit]").forEach(btn => {
      btn.addEventListener("click", () => {
        this.editingVideoId = btn.dataset.edit;
        this.renderVideosTab(content);
      });
    });

    content.querySelectorAll("[data-delete]").forEach(btn => {
      btn.addEventListener("click", async () => {
        if (confirm("এই ভিডিওটা ডিলিট করতে চাও?")) {
          await DB.deleteVideo(btn.dataset.delete);
          this.renderVideosTab(content);
        }
      });
    });
  },

  // ================= SERIES TAB =================
  async renderSeriesTab(content) {
    const [seriesList, tags] = await Promise.all([DB.getAllSeries(), DB.getTags()]);
    const editing = this.editingSeriesId ? seriesList.find(s => s.id === this.editingSeriesId) : null;

    if (editing && this.seasonBuilderData.length === 0) {
      this.seasonBuilderData = JSON.parse(JSON.stringify(editing.seasons || []));
    }
    this._lastTab = editing ? "series-edit" : "series-new";

    content.innerHTML = `
      <h3>${editing ? "সিরিজ এডিট করো" : "নতুন সিরিজ যোগ করো"}</h3>
      <div class="form-group"><label>Title</label><input id="sTitle" value="${editing?.title || ""}"></div>
      <div class="form-group"><label>Description</label><textarea id="sDesc" rows="3">${editing?.description || ""}</textarea></div>
      <div class="form-group">
        <label>Tags</label>
        <div class="tag-checklist">
          ${tags.map(t => `
            <label><input type="checkbox" value="${t.name}" ${editing?.tags?.includes(t.name) ? "checked" : ""} class="sTagCheck"> ${t.name}</label>
          `).join("") || "<span>কোনো ট্যাগ নেই।</span>"}
        </div>
      </div>
      <div class="form-group"><label>Thumbnail URL</label><input id="sThumb" value="${editing?.thumbnailUrl || ""}"></div>

      <h4>সিজন ও এপিসোড</h4>
      <div id="seasonBuilderArea"></div>
      <button class="btn btn-secondary btn-small" id="addSeasonBtn">+ নতুন সিজন যোগ করো</button>

      <div style="margin-top:20px;">
        <button class="btn" id="saveSeriesBtn">${editing ? "আপডেট করো" : "পোস্ট করো"}</button>
        ${editing ? '<button class="btn btn-secondary" id="cancelSeriesEditBtn">বাতিল</button>' : ""}
      </div>

      <h3 style="margin-top:30px;">সব সিরিজ (${seriesList.length})</h3>
      ${seriesList.map(s => `
        <div class="admin-list-item">
          <div class="item-info">${s.title} <span class="card-meta">(${(s.seasons || []).length} সিজন)</span></div>
          <div class="item-actions">
            <button class="btn btn-secondary btn-small" data-edit-series="${s.id}">Edit</button>
            <button class="btn btn-small" style="background:#aa2222" data-delete-series="${s.id}">Delete</button>
          </div>
        </div>
      `).join("") || '<p class="empty-msg">কোনো সিরিজ নেই।</p>'}
    `;

    this.renderSeasonBuilder(content);

    document.getElementById("addSeasonBtn").addEventListener("click", () => {
      this.seasonBuilderData.push({ seasonNumber: this.seasonBuilderData.length + 1, title: "", episodes: [] });
      this.renderSeasonBuilder(content);
    });

    document.getElementById("saveSeriesBtn").addEventListener("click", async () => {
      const data = {
        title: document.getElementById("sTitle").value.trim(),
        description: document.getElementById("sDesc").value.trim(),
        tags: Array.from(document.querySelectorAll(".sTagCheck:checked")).map(c => c.value),
        thumbnailUrl: document.getElementById("sThumb").value.trim(),
        seasons: this.seasonBuilderData
      };
      if (!data.title) { alert("Title দিতে হবে।"); return; }

      if (editing) await DB.updateSeries(editing.id, data);
      else await DB.addSeries(data);

      this.editingSeriesId = null;
      this.seasonBuilderData = [];
      this.renderSeriesTab(content);
    });

    if (editing) {
      document.getElementById("cancelSeriesEditBtn").addEventListener("click", () => {
        this.editingSeriesId = null;
        this.seasonBuilderData = [];
        this.renderSeriesTab(content);
      });
    }

    content.querySelectorAll("[data-edit-series]").forEach(btn => {
      btn.addEventListener("click", () => {
        this.editingSeriesId = btn.dataset.editSeries;
        this.seasonBuilderData = [];
        this.renderSeriesTab(content);
      });
    });

    content.querySelectorAll("[data-delete-series]").forEach(btn => {
      btn.addEventListener("click", async () => {
        if (confirm("এই সিরিজটা ডিলিট করতে চাও?")) {
          await DB.deleteSeries(btn.dataset.deleteSeries);
          this.renderSeriesTab(content);
        }
      });
    });
  },

  renderSeasonBuilder(content) {
    const area = document.getElementById("seasonBuilderArea");
    area.innerHTML = this.seasonBuilderData.map((season, sIdx) => `
      <div class="season-builder">
        <div class="form-group">
          <label>সিজন নাম্বার / টাইটেল</label>
          <input type="number" class="seasonNumInput" data-sidx="${sIdx}" value="${season.seasonNumber}" style="width:80px;display:inline-block;">
          <input type="text" class="seasonTitleInput" data-sidx="${sIdx}" value="${season.title || ""}" placeholder="সিজন টাইটেল (ঐচ্ছিক)">
        </div>
        <div id="episodeArea-${sIdx}">
          ${(season.episodes || []).map((ep, eIdx) => `
            <div class="episode-builder">
              <div class="form-group">
                <label>এপিসোড নাম্বার</label>
                <input type="number" class="epNumInput" data-sidx="${sIdx}" data-eidx="${eIdx}" value="${ep.episodeNumber}">
              </div>
              <div class="form-group">
                <label>এপিসোড টাইটেল</label>
                <input type="text" class="epTitleInput" data-sidx="${sIdx}" data-eidx="${eIdx}" value="${ep.title || ""}">
              </div>
              <div class="form-group">
                <label>Video URL</label>
                <input type="text" class="epUrlInput" data-sidx="${sIdx}" data-eidx="${eIdx}" value="${ep.videoUrl || ""}">
              </div>
              <button class="btn btn-small" style="background:#aa2222" data-remove-ep data-sidx="${sIdx}" data-eidx="${eIdx}">এপিসোড মুছো</button>
            </div>
          `).join("")}
        </div>
        <button class="btn btn-secondary btn-small" data-add-ep="${sIdx}" style="margin-top:10px;">+ এপিসোড যোগ করো</button>
        <button class="btn btn-small" style="background:#aa2222;margin-top:10px;" data-remove-season="${sIdx}">সিজন মুছো</button>
      </div>
    `).join("") || '<p class="empty-msg">এখনো কোনো সিজন যোগ করা হয়নি।</p>';

    area.querySelectorAll(".seasonNumInput").forEach(inp => {
      inp.addEventListener("input", () => {
        this.seasonBuilderData[inp.dataset.sidx].seasonNumber = parseInt(inp.value) || 0;
      });
    });
    area.querySelectorAll(".seasonTitleInput").forEach(inp => {
      inp.addEventListener("input", () => {
        this.seasonBuilderData[inp.dataset.sidx].title = inp.value;
      });
    });
    area.querySelectorAll(".epNumInput").forEach(inp => {
      inp.addEventListener("input", () => {
        this.seasonBuilderData[inp.dataset.sidx].episodes[inp.dataset.eidx].episodeNumber = parseInt(inp.value) || 0;
      });
    });
    area.querySelectorAll(".epTitleInput").forEach(inp => {
      inp.addEventListener("input", () => {
        this.seasonBuilderData[inp.dataset.sidx].episodes[inp.dataset.eidx].title = inp.value;
      });
    });
    area.querySelectorAll(".epUrlInput").forEach(inp => {
      inp.addEventListener("input", () => {
        this.seasonBuilderData[inp.dataset.sidx].episodes[inp.dataset.eidx].videoUrl = inp.value;
      });
    });

    area.querySelectorAll("[data-add-ep]").forEach(btn => {
      btn.addEventListener("click", () => {
        const sIdx = btn.dataset.addEp;
        const eps = this.seasonBuilderData[sIdx].episodes;
        eps.push({ episodeNumber: eps.length + 1, title: "", videoUrl: "" });
        this.renderSeasonBuilder(content);
      });
    });

    area.querySelectorAll("[data-remove-ep]").forEach(btn => {
      btn.addEventListener("click", () => {
        this.seasonBuilderData[btn.dataset.sidx].episodes.splice(btn.dataset.eidx, 1);
        this.renderSeasonBuilder(content);
      });
    });

    area.querySelectorAll("[data-remove-season]").forEach(btn => {
      btn.addEventListener("click", () => {
        this.seasonBuilderData.splice(btn.dataset.removeSeason, 1);
        this.renderSeasonBuilder(content);
      });
    });
  },

  // ================= TAGS TAB =================
  async renderTagsTab(content) {
    const tags = await DB.getTags();
    content.innerHTML = `
      <h3>নতুন ট্যাগ যোগ করো</h3>
      <div class="form-group" style="display:flex;gap:10px;">
        <input id="newTagInput" placeholder="যেমন: Comedy, Drama, Action">
        <button class="btn" id="addTagBtn">যোগ করো</button>
      </div>
      <h3 style="margin-top:20px;">সব ট্যাগ (${tags.length})</h3>
      ${tags.map(t => `
        <div class="admin-list-item">
          <div class="item-info">${t.name}</div>
          <button class="btn btn-small" style="background:#aa2222" data-delete-tag="${t.id}">Delete</button>
        </div>
      `).join("") || '<p class="empty-msg">কোনো ট্যাগ নেই।</p>'}
    `;

    document.getElementById("addTagBtn").addEventListener("click", async () => {
      const val = document.getElementById("newTagInput").value.trim();
      if (!val) return;
      await DB.addTag(val);
      this.renderTagsTab(content);
    });

    content.querySelectorAll("[data-delete-tag]").forEach(btn => {
      btn.addEventListener("click", async () => {
        if (confirm("এই ট্যাগটা ডিলিট করতে চাও?")) {
          await DB.deleteTag(btn.dataset.deleteTag);
          this.renderTagsTab(content);
        }
      });
    });
  }
};
