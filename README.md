# WLMS — Warehouse & Logistics Management System
![Python](https://img.shields.io/badge/Python-3.x-blue?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?logo=fastapi)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)
![React](https://img.shields.io/badge/React-Frontend-61DAFB?logo=react)
![Status](https://img.shields.io/badge/Status-Under%20Development-orange)

A full-stack Warehouse and Logistics Management System built with FastAPI, React, and PostgreSQL. Covers the complete procurement and sales fulfillment lifecycle with role-based access control.



## Tech Stack

**Backend**
- Python 3.x
- FastAPI (REST APIs)
- PostgreSQL 16
- psycopg2
- JWT Authentication (python-jose, passlib)

**Frontend**
- React (Vite)
- Ant Design
- Axios
- React Router DOM

## Features

- JWT Authentication with role-based access control
- Three roles: Administrator, Warehouse Staff, Logistics Staff
- Full procurement flow: Purchase Orders → Goods Receipt Notes → Stock Updates
- Full sales flow: Sales Orders → Delivery Challans → Stock Dispatch
- Live stock tracking with low stock alerts
- Automatic stock reservation on Sales Order creation
- Automatic stock update on GRN confirmation
- Admin dashboard with business metrics
- User management (create, update, deactivate)
- Master data management (items, suppliers, customers)

## Project Structure

```text
warehouse-management-system/
│
├── fastapi/                           # Backend
│   ├── main.py                        # Application entry point
│   ├── database.py                    # PostgreSQL connection
│   ├── auth.py                        # JWT authentication & role-based access
│   ├── .env                           # Environment variables (not tracked)
│   │
│   ├── routers/                       # API endpoints
│   │   ├── auth.py
│   │   ├── users.py
│   │   ├── items.py
│   │   ├── suppliers.py
│   │   ├── customers.py
│   │   ├── stock.py
│   │   ├── purchase_orders.py
│   │   ├── grns.py
│   │   ├── sales_orders.py
│   │   ├── delivery_challans.py
│   │   └── uoms.py
│   │
│   └── schemas/                       # Pydantic schemas
│       ├── item.py
│       ├── supplier.py
│       ├── customer.py
│       ├── stock.py
│       ├── purchase_order.py
│       ├── grn.py
│       ├── sales_order.py
│       ├── delivery_challan.py
│       └── user.py
│
├── wlms-frontend/                     # Frontend
│   └── src/
│       ├── api/
│       │   └── axios.js               # Axios configuration with JWT interceptor
│       │
│       ├── components/
│       │   └── Layout.jsx             # Shared layout (Sidebar + Header)
│       │
│       └── pages/
│           ├── Login.jsx
│           ├── Dashboard.jsx
│           ├── Items.jsx
│           ├── Stock.jsx
│           ├── Suppliers.jsx
│           ├── Customers.jsx
│           ├── PurchaseOrders.jsx
│           ├── GRNs.jsx
│           ├── SalesOrders.jsx
│           ├── DeliveryChallans.jsx
│           └── Users.jsx
│
└── sql/                               # PostgreSQL Database Scripts
    ├── wlms_01_tables.sql
    ├── wlms_02_triggers.sql
    ├── wlms_03_views.sql
    └── wlms_04_procedures.sql
```

## Role Based Access

| Feature              | Administrator | Warehouse Staff | Logistics Staff |
|----------------------|:-------------:|:---------------:|:---------------:|
| Items (view)         | ✅            | ✅              | ✅              |
| Items (create)       | ✅            | ❌              | ❌              |
| Stock                | ✅            | ✅              | ✅              |
| Suppliers            | ✅            | ✅              | ❌              |
| Purchase Orders      | ✅            | ✅              | ❌              |
| Goods Receipts       | ✅            | ✅              | ❌              |
| Customers            | ✅            | ❌              | ✅              |
| Sales Orders         | ✅            | ❌              | ✅              |
| Delivery Challans    | ✅            | ❌              | ✅              |
| User Management      | ✅            | ❌              | ❌              |

## API Endpoints

| Method | Endpoint                        | Description                  |
|--------|---------------------------------|------------------------------|
| POST   | /auth/login                     | Login and get JWT token      |
| GET    | /auth/me                        | Get current user info        |
| GET    | /users                          | List all users               |
| POST   | /users                          | Create user                  |
| PUT    | /users/{id}                     | Update user                  |
| DELETE | /users/{id}                     | Deactivate user              |
| GET    | /items                          | List all items               |
| POST   | /items                          | Create item                  |
| GET    | /stock                          | Live stock status            |
| GET    | /suppliers                      | List suppliers               |
| POST   | /suppliers                      | Create supplier              |
| PUT    | /suppliers/{id}                 | Update supplier              |
| GET    | /customers                      | List customers               |
| POST   | /customers                      | Create customer              |
| PUT    | /customers/{id}                 | Update customer              |
| GET    | /purchase-orders                | List purchase orders         |
| POST   | /purchase-orders                | Create purchase order        |
| POST   | /purchase-orders/lines          | Add line to PO               |
| POST   | /purchase-orders/cancel         | Cancel PO                    |
| GET    | /grns                           | List GRNs                    |
| POST   | /grns                           | Create GRN                   |
| POST   | /grns/lines                     | Add line to GRN              |
| POST   | /grns/confirm                   | Confirm GRN (updates stock)  |
| GET    | /sales-orders                   | List sales orders            |
| POST   | /sales-orders                   | Create sales order           |
| POST   | /sales-orders/lines             | Add line to SO               |
| POST   | /sales-orders/advance           | Advance SO status            |
| POST   | /sales-orders/cancel            | Cancel SO                    |
| GET    | /delivery-challans              | List delivery challans       |
| POST   | /delivery-challans              | Create delivery challan      |
| POST   | /delivery-challans/lines        | Add line to DC               |
| POST   | /delivery-challans/dispatch     | Dispatch DC                  |
| POST   | /delivery-challans/deliver      | Mark DC as delivered         |

## Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL 16

### Database Setup
```bash
# Run the SQL files in order in pgAdmin or psql
psql -U postgres -d wlms3 -f sql/wlms_01_tables.sql
psql -U postgres -d wlms3 -f sql/wlms_02_triggers.sql
psql -U postgres -d wlms3 -f sql/wlms_03_views.sql
psql -U postgres -d wlms3 -f sql/wlms_04_procedures.sql
```

### Backend Setup
```bash
cd fastapi
python -m venv venv
venv\Scripts\activate      # Windows
pip install fastapi uvicorn psycopg2-binary python-dotenv python-jose[cryptography] passlib[bcrypt]
```

Create a `.env` file in the `fastapi/` folder:
DB_URL=postgresql://postgres:yourpassword@localhost:5432/wlms3

Run the backend:
```bash
uvicorn main:app --reload
```

API docs available at: `http://localhost:8000/docs`

### Frontend Setup
```bash
cd wlms-frontend
npm install
npm run dev
```

App available at: `http://localhost:5173`

### Default Users
Create users via the API docs at `/docs` or directly in the database.

## Database Design

The schema uses:
- **Stored Procedures** for all business operations
- **Triggers** for automatic stock management
- **Views** for complex reporting queries
- **Generated Columns** for computed fields (pending_quantity, line_total)

### Key Business Rules (enforced at database level)
- Stock is automatically reserved when a Sales Order line is created
- Stock is automatically updated when a GRN is confirmed
- A Delivery Challan can only be created for a Packed Sales Order
- A PO can only be cancelled if it is still Pending
- A SO cancellation automatically releases reserved stock

## Status
🚧 Currently in active development

## License

This project is licensed under the MIT License.
