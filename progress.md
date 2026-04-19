# Ratnawala — Progress Tracker
> Agent context file — read this first if switching agents.

---

## TECH STACK

| Layer       | Technology                                      |
|-------------|------------------------------------------------|
| Frontend    | React 18 + Vite + Tailwind CSS v4              |
| Animations  | Framer Motion + GSAP (marquee)                 |
| Backend     | Node.js + Express.js                           |
| Database    | MongoDB + Mongoose                             |
| Auth        | JWT + bcryptjs + role middleware               |
| Email       | Nodemailer (Gmail SMTP)                        |
| Payments    | Razorpay                                       |
| State       | Zustand (planned)                              |
| Forms       | React Hook Form                                |
| HTTP Client | Axios (planned)                                |

---

## DESIGN SYSTEM

- **Colors**: Cream `#FDFAF5`, Espresso `#2C1A0E`, Gold `#C9A84C/#B8960C`, Antique `#8A7060`
- **Typography**: Cormorant Garamond (headings) · Cinzel (labels) · EB Garamond (body) · Josefin Sans (UI)
- **Aesthetic**: Sunlit atelier, warm cream, antique gold, NO 3D models anywhere
- **Images**: Static gem photos from `/public/images/` using getGemImage(gemId)

---

## FILE STRUCTURE

```
ratnawala3/
├── client/                     # React + Vite app (port 5173)
│   ├── public/images/          # 36 gem images (imgi_X_Y.jpg)
│   ├── src/
│   │   ├── components/
│   │   │   ├── gems/GemCard.jsx        ✅
│   │   │   ├── ui/Button.jsx           ✅
│   │   │   ├── ui/Divider.jsx          ✅
│   │   │   ├── ui/Badge.jsx            ✅
│   │   │   └── layout/Navbar.jsx       ✅
│   │   │   └── layout/Footer.jsx       ✅
│   │   │   └── layout/CustomCursor.jsx ✅
│   │   ├── data/
│   │   │   ├── gemstones.js    ✅ 36 gems complete
│   │   │   └── getGemImage.js  ✅ ID→image map
│   │   ├── pages/
│   │   │   ├── Home.jsx        ✅ No 3D — floating static images
│   │   │   ├── GemListing.jsx  ✅ Filter by planet, search
│   │   │   ├── GemDetail.jsx   ✅ No 3D — same image as card, order form
│   │   │   ├── OurWorks.jsx    ✅ Masonry gallery + lightbox
│   │   │   ├── AboutUs.jsx     ✅
│   │   │   ├── Enquiry.jsx     ✅
│   │   │   ├── Contact.jsx     ✅
│   │   │   └── auth/Login.jsx  ✅ No 3D
│   │   └── App.jsx             ✅ Routes configured
│   └── three/                  ⚠️  UNUSED — 3D code kept but never imported
│
└── server/                     # Express + MongoDB backend (port 5000)
    ├── config/db.js            ✅
    ├── models/
    │   ├── User.js             ✅ roles: customer / sub_admin / admin
    │   ├── Gem.js              ✅
    │   ├── Enquiry.js          ✅ CRM pipeline statuses
    │   └── Order.js            ✅ Razorpay fields, fulfillment
    ├── controllers/
    │   ├── authController.js   ✅ register, login, getMe, wishlist
    │   ├── gemController.js    ✅ CRUD + filters
    │   ├── enquiryController.js✅ create + admin pipeline
    │   └── orderController.js  ✅ Razorpay create+verify
    ├── middleware/auth.js       ✅ protect, optionalAuth, authorize(roles)
    ├── routes/
    │   ├── authRoutes.js       ✅
    │   ├── gemRoutes.js        ✅
    │   ├── enquiryRoutes.js    ✅
    │   └── orderRoutes.js      ✅
    ├── utils/mailer.js         ✅ Nodemailer email notifications
    ├── index.js                ✅ Express bootstrap
    ├── .env.example            ✅ All env vars documented
    └── .env                    ✅ Copy of example (fill in real keys)
```

---

## PHASES

- [x] **Phase 1** — Project setup (Vite, Tailwind v4, npm deps)
- [x] **Phase 2** — Design system (globals.css, tokens, fonts)
- [x] **Phase 3** — Gemstone data (gemstones.js 36 gems, getGemImage.js)
- [x] **Phase 4** — UI Components (Button, Badge, Divider, GemCard)
- [x] **Phase 5** — Layout (Navbar, Footer, CustomCursor)
- [x] **Phase 6** — Pages (Home, GemListing, GemDetail, About, Enquiry, Contact, Login)
- [x] **Phase 7** — Routing (App.jsx, AnimatePresence transitions)
- [x] **Phase 8** — Our Works masonry gallery + lightbox (**OurWorks.jsx**)
- [x] **Phase 9** — Removed all 3D — static images everywhere, no Three.js in bundle
- [x] **Phase 10** — Backend (Express + MongoDB + JWT + Razorpay + Nodemailer)
- [ ] **Phase 11** — Admin dashboard (enquiry CRM, order management)
- [ ] **Phase 12** — Connect frontend forms to backend API (Axios calls)
- [ ] **Phase 13** — Seed MongoDB with all 36 gems
- [ ] **Phase 14** — Production deploy (Vercel frontend + Railway/Render backend)

---

## CURRENT STATUS
> **Phases 1–10 COMPLETE.** 
> - 3D removed everywhere — site uses floating static images with drop-shadow + radial glow
> - Our Works masonry gallery done — 16 curated works, category filter, click lightbox
> - Full backend wired: User/Gem/Enquiry/Order models, JWT auth, Razorpay, Nodemailer mailer
> - To run backend: copy `.env.example` to `.env`, fill in MONGO_URI + keys, `npm run dev`
> - Frontend at http://localhost:5173 — `npm run dev` from `/client`

## AGENT HANDOFF NOTES
If switching agents, read this file first, then:
1. Run client: `cd client && npm run dev`
2. Run server: `cd server && npm run dev` (needs .env filled)
3. Next priorities: Phase 11 (admin UI) and Phase 12 (API integration for forms)
4. Design aesthetic: warm cream #FDFAF5, antique gold #C9A84C, no 3D
5. All gem images: via `getGemImage(gem.id)` → `/images/imgi_X_Y.jpg`
