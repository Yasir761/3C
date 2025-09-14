# 3C - Career Counselling Chat

<p align="center">
  <img src="https://3-c-amber.vercel.app/logo.png" alt="3C Logo" width="120" />
</p>

An AI-powered career counseling chat app built with Next.js, TypeScript, tRPC, TanStack Query, ShadCN/UI, and PostgreSQL.  
It provides intelligent career advice, chat history persistence, and session management with a modern, responsive UI.

🚀 **Live Demo**: [https://3-c-amber.vercel.app/](https://3-c-amber.vercel.app/)  
📦 **Repository**: [GitHub Repo](https://github.com/Yasir761/3C)

---

<p align="center">
  <img src="https://3-c-amber.vercel.app/hero.png" alt="3C Hero Image" width="100%" />
</p>

---

## ✨ Features

### AI Career Counseling Chat
- AI-powered responses for career advice using **Groq API**.  
- Context-aware conversation flow.  

### Chat Persistence
- Messages and sessions stored in **PostgreSQL** (via Prisma).  

### Chat History & Session Management
- Start new sessions with custom names.  
- Browse and continue previous sessions.  
- Pagination for large histories.  

### Modern UI/UX
- Responsive design (desktop + mobile).  
- **ShadCN/UI** components with Tailwind CSS.  
- Animated transitions with Framer Motion.  

### Bonus Features
- Authentication (NextAuth).  
- Light/Dark mode preview.  
- Real-time typing indicator.  

---

## 🛠 Tech Stack
- **Framework**: Next.js (TypeScript)  
- **Backend**: tRPC  
- **Frontend**: React, ShadCN/UI, TailwindCSS, Framer Motion  
- **Data Fetching**: TanStack Query  
- **Database**: PostgreSQL (Supabase)  
- **ORM**: Prisma  
- **AI API**: Groq  

---

1. **Clone the repo**  
```bash
git clone https://github.com/Yasir761/3C.git
cd 3C
Install dependencies
 ```

```bash
Copy code
npm install
# or
yarn
```

***Set up environment variables***
Create a .env file in the root with the following variables:
NEXT_PUBLIC_APP_URL=https://yourdomain.com
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
NEXTAUTH_SECRET=your_nextauth_secret
GROQ_API_KEY=your_groq_api_key
Run database migrations

```bash
Copy code
npx prisma migrate dev
Start the development server
```

```bash
Copy code
npm run dev
# or
yarn dev
```
***Open the app***
Visit http://localhost:3000 in your browser.



## 👨‍💻 Authors
- [Yasir](https://codilad.dev)
