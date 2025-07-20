# Gemini Frontend Clone (Chat Application)

This is a lightweight Gemini-style chat application built using **Next.js App Router**, **Zustand**, **Zod**, **React Hook Form**, and **localStorage**. It supports chatrooms, dark mode, authentication with phone and OTP (simulated), file upload, and AI-styled chat messages.

---

## 🔧 Features

- ✅ Phone-based login with OTP simulation
- ✅ Create, delete, and search chatrooms
- ✅ Message syncing in localStorage
- ✅ AI/user message UI differentiation
- ✅ Image/file upload
- ✅ Dark mode toggle with Zustand
- ✅ Fully responsive layout with SCSS modules

---

## 🚀 Tech Stack

- [Next.js (App Router)](https://nextjs.org/docs/app)
- [Zustand](https://github.com/pmndrs/zustand)
- [Zod](https://zod.dev/)
- [React Hook Form](https://react-hook-form.com/)
- [Sass / SCSS modules](https://sass-lang.com/)

---

## 📦 Installation

```bash
git clone https://github.com/murtazshaikh/49_Gemini_Frontend_Clone.git
cd 49_Gemini_Frontend_Clone
npm install
```

---

## ▶️ Run the App

```bash
npm run dev
```

Visit `http://localhost:3000` to start.

---

## 🛠 Project Structure

```
.
├── app/
│   ├── auth/                 # Auth form UI and logic
│   ├── dashboard/            # Chatroom list and creation
│   └── [chatroomId]/         # Dynamic chat UI per room
│
├── components/               # Reusable components
├── store/                    # Zustand stores (theme, auth)
├── styles/                   # SCSS modules
├── utils/                    # Helper functions
├── public/                   # Static assets
└── README.md
```

---

## 🔐 Authentication

- User logs in with phone number and country code.
- OTP is **simulated** (no real API).
- Session stored in `localStorage` and synced on refresh.

---

## 🌙 Dark Mode

- Zustand handles global theme state
- Dark mode preference saved in `localStorage`
- Applied using `.dark` class on chat box

---

## 📂 LocalStorage Usage

- `auth`: stores phone + country code
- `chatrooms`: array of created chatroom objects
- `messages_{chatroomId}`: stores messages for each room

---

## 📌 Notes

- This is a frontend-only project.
- AI responses are mocked or handled via conditional rendering.
- Easily extendable for backend or OpenAI integration.

---

## 📸 Screenshots

| Auth Flow | Chatroom Page | Dark Mode |
|-----------|----------------|------------|
| ![Auth](./public/screens/auth.png) | ![Dashboard](./public/screens/dashboard.png) | ![Dark](./public/screens/darkmode.png) |

---

## 🧑‍💻 Contributing

1. Fork the project
2. Create your feature branch: `git checkout -b feature/awesome-feature`
3. Commit your changes: `git commit -m 'Add awesome feature'`
4. Push to the branch: `git push origin feature/awesome-feature`
5. Open a pull request

---
