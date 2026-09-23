# Java Corn 🎬🌽

একটি SPA (Single Page Application) ভিডিও/সিরিজ স্ট্রিমিং ওয়েবসাইট — Firebase (Auth + Firestore) দিয়ে তৈরি, ভিডিও হোস্টিং Bunny.net/Cloudflare Stream এর মতো এক্সটার্নাল CDN থেকে।

## ✨ ফিচারসমূহ

- 🏠 হোমপেজ — সাম্প্রতিক ভিডিও ও সিরিজ
- 🎞 Videos সেকশন — Category (Short/Movie/Video) ও Tag দিয়ে ফিল্টার
- 📺 Series সেকশন — সিজন ও এপিসোড স্ট্রাকচার সহ
- ▶️ Watch পেজ — এক্সটার্নাল ভিডিও URL (Bunny/Cloudflare) embed প্লেয়ারে চলে
- 🔐 Admin Panel — Firebase Auth (Email/Password) দিয়ে সুরক্ষিত
  - ভিডিও Add/Edit/Delete
  - সিরিজ + সিজন + এপিসোড Add/Edit/Delete
  - ট্যাগ ম্যানেজমেন্ট
- 🧭 **SPA রাউটিং** — প্রতিটা পেজে আলাদা URL (`/videos`, `/watch/video/xyz`), কিন্তু পুরো পেজ রিফ্রেশ হয় না। মোবাইল/ব্রাউজার ব্যাক বাটন চাপলে আগের ভিউতে ফিরে যায়, পুরো সাইট আবার লোড হয় না।
- 🏷 `isPro` ফিল্ড রেডি রাখা হয়েছে ভবিষ্যতের Ad-unlock ফিচারের জন্য

## 🔧 সেটআপ করার ধাপ

### ১. Firebase প্রজেক্ট বানাও
1. [console.firebase.google.com](https://console.firebase.google.com) এ যাও, "Add project" ক্লিক করো
2. প্রজেক্টের নাম দাও (যেমন `java-corn`)
3. বাম মেনু থেকে **Build → Authentication** এ যাও → "Get started" → **Email/Password** প্রোভাইডার চালু করো
4. **Authentication → Users** ট্যাবে গিয়ে "Add user" দিয়ে নিজের অ্যাডমিন ইমেইল/পাসওয়ার্ড বানাও (এই ইমেইল-পাসওয়ার্ড দিয়েই তুমি `/login` পেজে ঢুকবে)
5. বাম মেনু থেকে **Build → Firestore Database** এ যাও → "Create database" → production mode এ শুরু করো
6. **Project Settings (⚙️ আইকন) → General** ট্যাবে নিচে "Your apps" এ **Web (</>) আইকনে** ক্লিক করে একটা app রেজিস্টার করো — তখন একটা `firebaseConfig` অবজেক্ট দেখাবে

### ২. Config বসাও
`js/firebaseConfig.js` ফাইল ওপেন করে Firebase Console থেকে পাওয়া key গুলো বসাও:
```js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

### ৩. Firestore Security Rules বসাও
Firebase Console → Firestore Database → Rules ট্যাবে গিয়ে `firestore.rules` ফাইলের কন্টেন্ট পেস্ট করে Publish করো। এটা নিশ্চিত করে যে **শুধু তুমি (লগইন করা অবস্থায়)** ডেটা লিখতে/এডিট করতে পারবে, আর সবাই শুধু পড়তে পারবে।

### ৪. হোস্ট করো
**Firebase Hosting দিয়ে (সাজেস্টেড, কারণ `firebase.json` আগে থেকেই রেডি):**
```bash
npm install -g firebase-tools
firebase login
firebase init hosting   # existing project সিলেক্ট করো, public directory "." দাও
firebase deploy
```

**অথবা GitHub Pages দিয়ে** — তবে GitHub Pages এ SPA রাউটিং এর জন্য একটু আলাদা কনফিগ লাগবে (404.html trick), Firebase Hosting সবচেয়ে সহজ এখানে।

## 🎥 ভিডিও যোগ করার নিয়ম

১. `/login` এ গিয়ে অ্যাডমিন ইমেইল/পাসওয়ার্ড দিয়ে লগইন করো
২. Admin Panel → Videos ট্যাব → ফর্ম পূরণ করো:
   - Title, Description
   - Category (Short/Movie/Video)
   - Tags (আগে Tags ট্যাব থেকে ট্যাগ বানিয়ে রাখতে হবে)
   - **Video URL** — এখানে Bunny.net বা Cloudflare Stream থেকে পাওয়া **embed URL** বসাও (ডিরেক্ট ফাইল লিংক না, embed/iframe লিংক)
   - Thumbnail URL
৩. "পোস্ট করো" ক্লিক করলেই সাথে সাথে পাবলিক সাইটে দেখা যাবে

## 📺 সিরিজ যোগ করার নিয়ম

Admin Panel → Series ট্যাব → Title/Description/Tags দিয়ে "নতুন সিজন যোগ করো" ক্লিক করো → প্রতিটা সিজনে "এপিসোড যোগ করো" দিয়ে এপিসোডের নাম্বার, টাইটেল ও Video URL বসাও।

## 📂 প্রজেক্ট স্ট্রাকচার

```
java-corn/
│
├── index.html            # SPA এন্ট্রি পয়েন্ট
├── firebase.json         # Hosting rewrite rule
├── firestore.rules       # ডাটাবেজ সিকিউরিটি রুলস
│
├── css/
│   ├── style.css
│   └── admin.css
│
└── js/
    ├── firebaseConfig.js  # ⚠️ তোমার Firebase key এখানে বসাও
    ├── router.js          # SPA রাউটার
    ├── auth.js
    ├── db.js
    ├── main.js
    │
    └── views/
        ├── home.js
        ├── videos.js
        ├── series.js
        ├── watch.js
        ├── login.js
        └── admin.js
```

## ⚠️ গুরুত্বপূর্ণ নোট

- **Video URL** সবসময় "embed" ফরম্যাটের হতে হবে (iframe এ বসানোর উপযোগী), সরাসরি .mp4 ফাইল লিংক না দেওয়াই ভালো — Bunny.net/Cloudflare Stream এর ড্যাশবোর্ড থেকে "Embed Code" বা "Player URL" কপি করো
- localhost এ টেস্ট করতে `npx serve .` বা Firebase Hosting emulator ব্যবহার করো (`firebase serve`)
- Ad-unlock (Pro ভিডিও, ৩টা অ্যাড দেখে আনলক) ফিচারটা এখনো যোগ করা হয়নি — ডেটাবেজে `isPro` ফিল্ড রেডি আছে, চাইলে পরে এই লজিক যোগ করা যাবে
