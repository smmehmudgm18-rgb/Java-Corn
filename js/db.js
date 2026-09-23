// 💾 Firestore ডাটাবেজ ফাংশন — video, series, tags এর সব read/write এখানে

const DB = {
  // ---------- VIDEOS ----------
  async getVideos(filters = {}) {
    let ref = db.collection("videos").orderBy("createdAt", "desc");
    const snap = await ref.get();
    let items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    if (filters.category) items = items.filter(v => v.category === filters.category);
    if (filters.tag) items = items.filter(v => (v.tags || []).includes(filters.tag));
    return items;
  },

  async getVideoById(id) {
    const doc = await db.collection("videos").doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  },

  addVideo(data) {
    return db.collection("videos").add({
      ...data,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  },

  updateVideo(id, data) {
    return db.collection("videos").doc(id).update(data);
  },

  deleteVideo(id) {
    return db.collection("videos").doc(id).delete();
  },

  // ---------- SERIES ----------
  // প্রতিটা series ডকুমেন্টে seasons অ্যারে embedded থাকে, প্রতিটা season এ episodes অ্যারে —
  // এতে অ্যাডমিন প্যানেল থেকে পুরো সিরিজ এক ডকুমেন্টেই read/write করা সহজ হয়।
  async getAllSeries(filters = {}) {
    const snap = await db.collection("series").orderBy("createdAt", "desc").get();
    let items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    if (filters.tag) items = items.filter(s => (s.tags || []).includes(filters.tag));
    return items;
  },

  async getSeriesById(id) {
    const doc = await db.collection("series").doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  },

  addSeries(data) {
    return db.collection("series").add({
      ...data,
      seasons: data.seasons || [],
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  },

  updateSeries(id, data) {
    return db.collection("series").doc(id).update(data);
  },

  deleteSeries(id) {
    return db.collection("series").doc(id).delete();
  },

  // ---------- TAGS ----------
  async getTags() {
    const snap = await db.collection("tags").orderBy("name").get();
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },

  addTag(name) {
    return db.collection("tags").add({ name });
  },

  deleteTag(id) {
    return db.collection("tags").doc(id).delete();
  }
};
