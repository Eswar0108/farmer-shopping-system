# 🌾 Farmer Shopping System

A full-stack e-commerce application for farmer products with admin and customer portals.

**Live Demo:**
- Frontend: https://frontend-inky-beta-44.vercel.app
- Backend API: https://farmer-shopping-system-production.up.railway.app/api/v1
- API Docs: https://farmer-shopping-system-production.up.railway.app/docs

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, React Router, Axios, TanStack React Query |
| Backend | Python 3.12, FastAPI, SQLAlchemy 2.0, Alembic |
| Database | PostgreSQL (Neon DB) |
| Auth | JWT (Admin + Customer) |
| Deployment | Vercel (frontend), Railway (backend) |

## Project Structure

```
farmer-shopping-system/
├── backend/                    # FastAPI backend
│   ├── app/
│   │   ├── api/v1/            # REST API routes (auth, products, cart, orders)
│   │   ├── core/              # Config, database, security, dependencies
│   │   ├── models/            # SQLAlchemy models (6 tables)
│   │   ├── schemas/           # Pydantic validation schemas
│   │   ├── services/          # Business logic layer
│   │   └── main.py            # FastAPI entry point
│   ├── migrations/            # Alembic database migrations
│   ├── Dockerfile
│   ├── .env.example
│   └── requirements.txt
├── frontend/                   # React.js frontend
│   ├── src/
│   │   ├── api/               # Axios client + API modules
│   │   ├── components/        # Reusable components (admin + customer)
│   │   ├── context/           # Auth context
│   │   ├── pages/             # Page components (admin + customer)
│   │   ├── routes/            # Route definitions + guards
│   │   ├── styles/            # CSS files
│   │   ├── services/          # API service modules
│   │   └── main.jsx
│   ├── vercel.json            # SPA rewrite rules
│   ├── Dockerfile
│   └── package.json
└── README.md
```

## Demo Credentials

| Portal | Email | Password |
|--------|-------|----------|
| **Admin** (https://frontend-inky-beta-44.vercel.app/admin/login) | `admin@farmershop.com` | `admin123` |
| **Customer** (https://frontend-inky-beta-44.vercel.app/login) | Register via sign-up page | — |

To login as admin:
1. Visit `/admin/login`
2. Enter `admin@farmershop.com` / `admin123`

To login as customer:
1. Visit `/register` and create an account
2. Then login at `/login`

## Local Development

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env        # Edit DATABASE_URL with your connection string
PYTHONPATH=. alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

API runs at http://localhost:8000, docs at http://localhost:8000/docs

Seed admin (first time only):
```bash
curl -X POST http://localhost:8000/api/v1/auth/seed
# Email: admin@farmershop.com, Password: admin123
```

### Frontend

```bash
cd frontend
npm install
echo "VITE_API_URL=http://localhost:8000/api/v1" > .env
npm run dev
```

Frontend runs at http://localhost:5173

### Using Neon DB (Recommended)
Set in `backend/.env`:
```env
DATABASE_URL=postgresql://user:pass@ep-xxx.aws.neon.tech/neondb?sslmode=require
```

## Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel --prod
```
Set env var in Vercel dashboard:
- `VITE_API_URL` = `https://your-backend-url.up.railway.app/api/v1`

### Backend (Railway)
1. Connect GitHub repo → Railway
2. Set root directory: `backend`
3. Add environment variables in Railway dashboard:
   - `DATABASE_URL`
   - `SECRET_KEY`
   - `CORS_ORIGINS` = `https://your-frontend.vercel.app,*`
   - `ADMIN_EMAIL`, `ADMIN_PASSWORD`

## Features

### Admin Portal
- Secure login with JWT authentication (`role: admin`)
- Add, edit, delete products
- Activate/deactivate products
- Update stock quantities
- View all products with pagination

### Customer Portal
- Register customer account and Sign In with JWT authentication (`role: customer`)
- Browse all active products
- Search products by name
- Filter products by category
- View product details
- Add products to cart (only available for authenticated customers, prompts login for guests)
- Update cart quantities
- Remove items from cart
- View shopping cart
- Checkout with automatic stock deduction (gated behind customer authorization)
- View order history
- View order details

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/auth/login` | Admin login | No |
| POST | `/api/v1/auth/seed` | Seed admin user | No |
| POST | `/api/v1/customer/auth/register` | Customer sign up | No |
| POST | `/api/v1/customer/auth/login` | Customer login | No |
| GET | `/api/v1/products` | List products | No |
| GET | `/api/v1/products/{id}` | Get product details | No |
| POST | `/api/v1/products` | Create product | Admin |
| PUT | `/api/v1/products/{id}` | Update product | Admin |
| DELETE | `/api/v1/products/{id}` | Delete product | Admin |
| PATCH | `/api/v1/products/{id}/status` | Toggle active status | Admin |
| PATCH | `/api/v1/products/{id}/stock` | Update stock | Admin |
| GET | `/api/v1/categories` | List categories | No |
| POST | `/api/v1/categories` | Create category | Admin |
| GET | `/api/v1/cart` | View cart | Customer |
| POST | `/api/v1/cart/items` | Add to cart | Customer |
| PUT | `/api/v1/cart/items/{id}` | Update cart item | Customer |
| DELETE | `/api/v1/cart/items/{id}` | Remove from cart | Customer |
| POST | `/api/v1/orders/checkout` | Checkout | Customer |
| GET | `/api/v1/orders` | Order history | Customer |
| GET | `/api/v1/orders/{id}` | Order details | Customer |

## Business Rules

- Only active products are displayed to customers
- Customers cannot add products beyond available stock
- Product quantity never becomes negative
- Grand total is calculated automatically
- Product stock is updated after successful checkout (in a single transaction with row locking)
- All forms have proper validation

## Assumptions

1. **Admin is pre-seeded** — Admin credentials are configured via `.env` and seeded via the `/auth/seed` endpoint.
2. **Product images are URLs** — No file upload functionality; images are stored as URL strings.
3. **Cart persistence** — Customer shopping carts are saved in the database, persisting across logins and devices.
4. **Currency is INR (₹)** — All prices are stored as `DECIMAL(10,2)` and displayed in Indian Rupees.
5. **Customer authentication required** — Customers must register and login to add items to cart and checkout.

## Git Security

⚠️ Never commit `.env` files — they contain secrets. This repo excludes them via `.gitignore`.
If credentials were accidentally pushed, rotate them and rewrite git history:
```bash
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch backend/.env" --prune-empty -- --all
git push --force origin main