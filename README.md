# 🚀 Himanshu Raj — Portfolio 2026

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)
![Prisma](https://img.shields.io/badge/Prisma-6.4.1-2D3748?style=for-the-badge&logo=prisma)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?style=for-the-badge&logo=vercel)

**A modern, full-stack developer portfolio built with Next.js 16, MongoDB, and Framer Motion.**

[🌐 Live Demo](https://himanshuraj-portfolio.vercel.app) · [📧 Contact](mailto:himanshuraj97653@gmail.com) · [💼 LinkedIn](https://linkedin.com/in/himanshuraj)

</div>

---

## ✨ Features

- 🎨 **Dark / Light Mode** — Seamless theme switching with `next-themes`
- ⚡ **Dynamic Data** — All projects, skills, and content served from MongoDB via Prisma
- 🔐 **Admin Panel** — Password-protected dashboard to manage all content (projects, skills, blog, certificates, achievements)
- 📊 **Analytics** — Built-in page view and event tracking
- 📬 **Contact Form** — Email delivery via Nodemailer
- 🖼️ **Image Uploads** — Cloudinary integration for media management
- 💨 **Smooth Animations** — Framer Motion throughout
- 📱 **Fully Responsive** — Mobile-first design
- 🔍 **SEO Optimized** — Open Graph, Twitter Cards, meta tags on every page

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Frontend** | React 19, Framer Motion, Lucide Icons |
| **Styling** | Tailwind CSS 4, Custom CSS Variables |
| **Database** | MongoDB Atlas |
| **ORM** | Prisma 6 |
| **Auth** | NextAuth v5 + bcryptjs |
| **Storage** | Cloudinary |
| **Email** | Nodemailer |
| **Deployment** | Vercel |

---

## 📂 Project Structure

```
Portfolio-2026/
├── app/                    # Next.js App Router pages
│   ├── admin/              # Protected admin dashboard
│   ├── api/                # REST API routes
│   │   ├── projects/       # Projects CRUD
│   │   ├── skills/         # Skills CRUD
│   │   ├── blog/           # Blog CRUD
│   │   └── ...             # Other endpoints
│   └── ...                 # Public pages
├── components/
│   ├── sections/           # Hero, About, Projects, Skills, etc.
│   ├── layout/             # Navbar, Footer, LoadingScreen
│   └── ui/                 # Reusable UI components
├── lib/                    # Prisma client, Auth, Cloudinary, Nodemailer
├── prisma/
│   └── schema.prisma       # MongoDB models
└── public/                 # Static assets, favicon
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Cloudinary account (for image uploads)

### Installation

```bash
# Clone the repository
git clone https://github.com/himanshuraj108/Portfolio-2026.git
cd Portfolio-2026

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

```env
DATABASE_URL="mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<db>?appName=Portfolio"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_PASSWORD="your-admin-password"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
NODEMAILER_EMAIL="your-email@gmail.com"
NODEMAILER_PASSWORD="your-app-password"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Admin Panel

Navigate to [http://localhost:3000/admin](http://localhost:3000/admin) and login with your admin password to manage all portfolio content.

---

## 📸 Sections

| Section | Description |
|---|---|
| **Hero** | Animated intro with name, tagline, CTA buttons |
| **About** | Bio, stats, availability status |
| **Skills** | Filterable skill grid with category color coding |
| **Projects** | Featured + all projects with live/GitHub links |
| **Education** | Academic timeline |
| **Certificates** | Verified certificates with logos |
| **Achievements** | Competitive programming & platform stats |
| **Blog** | Markdown-powered blog with syntax highlighting |
| **Testimonials** | Peer and collaborator testimonials |
| **Contact** | Email form + social links |

---

## 🌟 Featured Projects

1. **Vertex CRM** — Enterprise CRM with TypeScript full-stack
2. **Apna Lakshay — AI-Powered LMS** — LLM-integrated Learning Management System
3. **Your Code Visualizer (YCV)** — AI-powered code visualization tool
4. **AI Investment Research Agent** — Autonomous financial research AI agent
5. **AI-Powered Blog App** — Smart content creation platform
6. **AI-Powered Resume Builder** — ATS-optimized resume generation

---

## ⚡ Performance

- **Turbopack** build for blazing fast dev experience
- **Image optimization** via Next.js `<Image>` + Cloudinary CDN
- **Static generation** for public pages, dynamic for admin
- **Skeleton loaders** on all data-fetched sections
- **Lazy-loaded iframes** for project previews

---

## 🗺️ Roadmap

- [ ] AI-powered "Chat with Portfolio" feature
- [ ] GitHub activity integration
- [ ] Blog comment system
- [ ] Resume PDF auto-generation
- [ ] Multi-language support (i18n)
- [ ] PWA support

---

## 🤝 Contributing

This is a personal portfolio but feel free to fork and adapt it for your own use!

```bash
# Fork the repo, then:
git clone https://github.com/<your-username>/Portfolio-2026.git
cd Portfolio-2026
npm install
# Create your feature branch
git checkout -b feature/amazing-feature
git commit -m "feat: add amazing feature"
git push origin feature/amazing-feature
```

---

## 📄 License

MIT © [Himanshu Raj](https://github.com/himanshuraj108)

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/himanshuraj108">Himanshu Raj</a>
  <br/>
  <sub>⭐ Star this repo if you found it helpful!</sub>
</div>
