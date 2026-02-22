# SheShield – Girls Safety & Emergency Support System

Full-stack web application for girls' safety: emergency alerts, incident reporting, emergency contacts, and safety tips. **No OTP** – authentication is email + password with JWT.

## Tech Stack

- **Frontend:** React, HTML5, CSS3, JavaScript (ES6), React Router, Axios, Chart.js
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Auth:** JWT, bcrypt (password hashing)

## Project Structure

```
girls-security/
├── client/          # React frontend
│   ├── public/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       └── services/
├── server/          # Node.js + Express backend
│   ├── config/
│   ├── middleware/
│   ├── routes/
│   └── index.js
├── database/        # SQL schema
│   └── schema.sql
└── README.md
```

## Setup

### 1. Database (PostgreSQL)

- Install PostgreSQL and create a database, e.g. `sheshield`.
- Run the schema:

```bash
psql -U your_user -d sheshield -f database/schema.sql
```

### 2. Backend

```bash
cd server
cp .env.example .env
# Edit .env: set PORT, JWT_SECRET, DATABASE_URL (e.g. postgresql://user:pass@localhost:5432/sheshield)
npm install
npm run dev
```

Server runs at `http://localhost:5000`.

### 3. Frontend

```bash
cd client
npm install
npm start
```

App runs at `http://localhost:3000` and proxies API requests to the backend.

### 4. Create an admin user

After registering a normal user, promote them to admin in the database:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

## API Routes

| Method | Route | Description |
|--------|--------|-------------|
| POST | `/api/auth/register` | Register (email + password, hashed) |
| POST | `/api/auth/login` | Login (returns JWT) |
| GET | `/api/auth/me` | Current user (protected) |
| PUT | `/api/auth/profile` | Update name (protected) |
| GET/POST | `/api/contacts` | List / add emergency contacts |
| PUT/DELETE | `/api/contacts/:id` | Update / delete contact |
| POST | `/api/emergency` | Send emergency alert |
| GET | `/api/emergency` | List user's alerts |
| GET/POST | `/api/reports` | List / submit incident reports |
| GET | `/api/admin/users` | All users (admin) |
| GET | `/api/admin/reports` | All reports (admin) |
| PUT | `/api/admin/reports/:id/status` | Update report status (admin) |
| GET | `/api/admin/alerts` | All alerts (admin) |
| GET | `/api/admin/stats` | Dashboard counts (admin) |

## Features

- **Auth:** Secure registration and login (email + password, bcrypt, JWT). No OTP.
- **Dashboard:** One-click emergency alert button, quick links, past alerts.
- **Emergency contacts:** Add, edit, delete trusted contacts.
- **Incident reports:** Submit reports with description, location, date; view history.
- **Safety tips:** Static tips for different situations.
- **Profile:** View and update name.
- **Admin panel:** View users, reports, alerts; update report status; Chart.js analytics.
- **UI:** Purple/pink + white theme, responsive layout, navbar + footer, dark mode toggle, form validation, protected routes.

## Security

- Passwords hashed with bcrypt
- JWT for protected routes
- Input validation (express-validator)
- SQL parameterized queries (no raw concatenation)
- CORS configured for client origin

## License

MIT.
