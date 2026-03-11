# MYMETRO – Frontend & Backend Analysis Report

## 1. Repository Overview

**MYMETRO** is an Ahmedabad metro booking system built as a full-stack JavaScript monorepo:

```
MYMETRO/
├── frontend/          # React + Vite SPA
├── backend/           # Node.js + Express REST API
├── package.json       # Root (leaflet peer dep)
└── package-lock.json
```

---

## 2. Frontend Analysis

### Stack

| Concern | Library / Version |
|---------|-------------------|
| UI framework | React 19.2.0 |
| Build tool | Vite 7.3.1 |
| Routing | React Router DOM 7.13.0 |
| HTTP client | Axios 1.13.5 |
| Maps | Leaflet 1.9.4 + React-Leaflet 5.0.0 |
| Linting | ESLint 9 (react-hooks, react-refresh) |

### Directory Layout

```
frontend/src/
├── data/
│   └── ahmedabadMetroData.js      # Hardcoded metro lines & GPS coords
├── layouts/
│   ├── AdminLayout.jsx            # Sidebar wrapper for admin pages
│   └── CustomerLayout.jsx         # Navigation wrapper for customer pages
├── components/
│   ├── MetroMap.jsx               # Leaflet interactive map
│   └── SelectionPanel.jsx         # Route/station selector
└── pages/
    ├── LandingMap.jsx             # Public landing page + metro map
    ├── login.jsx                  # Login page
    ├── register.jsx               # Registration page
    ├── admin/
    │   ├── home.jsx               # Admin dashboard (stats)
    │   ├── create_admin.jsx       # Create admin user
    │   ├── update_fare.jsx        # Manage fare tiers
    │   ├── view_users.jsx         # Browse customers
    │   └── change_pass.jsx        # Change admin password
    └── customer/
        ├── home.jsx               # Journey search + map
        ├── change_pass.jsx        # Change customer password
        ├── CustomerSearchBar.jsx  # Search form component
        ├── CustomerMetroCard.jsx  # Result card component
        ├── CustomerMetroMap.jsx   # Embedded map for customer view
        ├── ahmedabadMetroData.js  # Duplicate of /data/ version (⚠)
        └── api.js                 # Axios helper functions
```

### Routing & Auth Flow

- JWT token, role (`Admin`/`Customer`), and user object are persisted in **localStorage** after login.
- Routes render different layouts based on `role`.
- **No protected route wrapper** – pages read localStorage directly; a user who manually sets `role=Admin` in localStorage can access admin UI.

### State Management

- Pure React hooks (`useState`, `useEffect`, `useMemo`).
- No Redux, Zustand, or Context API; all state is component-local.

### API Integration Issues

| Issue | Location |
|-------|----------|
| API base URL hardcoded to `http://localhost:5000` | `login.jsx`, `register.jsx` |
| Customer home page uses **local** metro data instead of `/api/customer/metros` | `customer/home.jsx` |
| No Axios interceptor for attaching the JWT header globally | `api.js` |
| Landing map never fetches station data from backend | `LandingMap.jsx` |

---

## 3. Backend Analysis

### Stack

| Concern | Library / Version |
|---------|-------------------|
| Framework | Express 4.22.1 |
| Database | MongoDB via Mongoose 9.1.5 |
| Auth | JWT (jsonwebtoken 9.0.3) |
| Password hashing | bcrypt 6.0.0 |
| Environment | dotenv 17.2.3 |
| CORS | cors 2.8.6 |

### Directory Layout

```
backend/src/
├── server.js              # App entry – middleware, routes, auto-creates default admin
├── config_db.js           # Mongoose connection
├── models/
│   ├── User.js            # Admin / Customer schema (bcrypt pre-save hook)
│   ├── Route.js           # Metro route + array of station names
│   ├── Schedule.js        # Frequency & time window per route
│   ├── Station.js         # Individual station metadata (unused ⚠)
│   ├── Fare.js            # Tiered pricing (p–t for 1-3 … 13+ stops)
│   └── Ticket.js          # Journey record (source, dest, date, user ref)
├── controllers/
│   ├── authController.js          # register, login, change-password
│   ├── adminController.js         # fare CRUD, user list, admin creation, stats
│   ├── searchController.js        # route search + fare calculation
│   └── customerMetroController.js # metro lines + stations list
├── routes/
│   ├── authRoutes.js
│   ├── adminRoutes.js
│   ├── customerRoutes.js
│   └── searchRoutes.js
├── middleware/
│   └── authMiddleware.js  # JWT bearer verification, role extraction
└── seed/
    ├── seedMetroData.js    # Seeds 3 demo routes (Blue/Yellow/Red)
    └── seedSearchData.js   # Seeds Blue Line sample data (has syntax error ⚠)
```

### API Endpoints

| Method | Path | Auth | Role | Purpose |
|--------|------|:----:|:----:|---------|
| POST | `/api/auth/register` | ✗ | – | Register customer |
| POST | `/api/auth/login` | ✗ | – | Login, returns JWT |
| PUT | `/api/auth/change-password` | ✓ | Any | Change own password |
| PUT | `/api/admin/change-password` | ✓ | Admin | Admin password change |
| GET | `/api/admin/get-fare` | ✓ | Admin | Fetch fare tiers |
| PUT | `/api/admin/update-fare` | ✓ | Admin | Update fare tiers |
| POST | `/api/admin/create-admin` | ✓ | Admin | Create new admin |
| GET | `/api/admin/get-users` | ✓ | Admin | Search customers |
| GET | `/api/admin/user/:id/journeys` | ✓ | Admin | User's ticket history |
| GET | `/api/admin/dashboard-stats` | ✓ | Admin | Total users + tickets |
| GET | `/api/customer/my-journeys` | ✓ | Customer | Own ticket history |
| GET | `/api/customer/search?source=&destination=` | ✓ | Customer | Find route + fare |
| GET | `/api/customer/metros` | ✓ | Customer | All metro lines |
| GET | `/api/customer/stations` | ✓ | Customer | All stations |

### Fare Calculation Logic

Tiers stored in the `Fare` collection and applied in `searchController.js`:

| Stops | Field | Default |
|-------|-------|---------|
| 1 – 3 | `p` | ₹10 |
| 4 – 6 | `q` | ₹20 |
| 7 – 9 | `r` | ₹30 |
| 10 – 12 | `s` | ₹40 |
| 13 + | `t` | ₹50 |

### Default Credentials

The server auto-creates an Admin if none exists:
- **Username**: `Admin1`
- **Password**: `admin123`

---

## 4. Issues & Recommendations

### 🔴 Critical

| # | Issue | Location | Fix |
|---|-------|----------|-----|
| 1 | No `.env.example` – new developers don't know required env vars | root | Add `.env.example` with `MONGO_URI`, `JWT_SECRET`, `PORT` |
| 2 | API base URL hardcoded to `http://localhost:5000` | `login.jsx`, `register.jsx` | Use `VITE_API_URL` env variable |
| 3 | Syntax error in seed file (`process.exit(1);s`) | `seedSearchData.js:40` | Remove trailing `s` |
| 4 | **No ticket booking endpoint** – `/api/customer/my-journeys` reads tickets but nothing creates them | backend | Add `POST /api/customer/book-ticket` |
| 5 | Client-side-only role check – no route guard on frontend | all pages | Add `<ProtectedRoute>` wrapper |

### 🟡 Major

| # | Issue | Location | Fix |
|---|-------|----------|-----|
| 6 | Duplicate metro data (local copy vs. backend DB) | `customer/ahmedabadMetroData.js` | Remove duplicate; fetch from `/api/customer/metros` |
| 7 | Frontend-backend data mismatch (2 lines vs. 3 lines, different station names) | frontend data / seed | Align seed data with Ahmedabad real metro lines |
| 8 | CORS uses defaults (all origins allowed) | `server.js` | Restrict to known frontend origin in production |
| 9 | No input validation on any endpoint | controllers | Add `express-validator` or `Joi` |
| 10 | `Station` model defined but never queried | `Station.js` | Either use it in search logic or remove |
| 11 | No pagination on user/ticket list endpoints | admin controllers | Add `limit`/`skip` or cursor pagination |
| 12 | No rate limiting on auth endpoints | `authRoutes.js` | Add `express-rate-limit` |
| 13 | No security headers | `server.js` | Add `helmet` |

### 🟢 Minor / Quality

| # | Issue | Fix |
|---|-------|-----|
| 14 | No README with setup/run instructions | Add root `README.md` |
| 15 | Inconsistent API response shape (`{ message, data }` vs raw array) | Standardise wrapper |
| 16 | No server-side logout (token cannot be revoked before 1-day expiry) | Add token blacklist or use short expiry + refresh tokens |
| 17 | No test infrastructure | Add Jest (backend) + Vitest/React Testing Library (frontend) |
| 18 | No Docker / docker-compose | Add for reproducible dev environment |
| 19 | `console.log` statements left in production code | Replace with proper logger (e.g., `winston`) |

---

## 5. What Works Well ✅

- Clean **MVC** pattern in Express backend.
- **JWT + bcrypt** authentication with role-based access control.
- **Leaflet** interactive map renders metro lines and station markers correctly.
- **Modular React** component structure (layouts, pages, components).
- Mongoose schemas are well-designed with proper references.
- Auto-seeds default admin on first run for ease of development.

---

## 6. Required Environment Variables

Create `/backend/.env`:

```env
MONGO_URI=mongodb://localhost:27017/mymetro
JWT_SECRET=your_very_secret_key
PORT=5000
```

Create `/frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

---

## 7. How to Run (Current State)

```bash
# Backend
cd backend
npm install
# Create .env with values above
node src/seed/seedMetroData.js   # (optional) seed DB
node src/server.js               # or: npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in the browser.
Default admin login: **Admin1 / admin123**
