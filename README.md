# Food Store Calculator

A full-stack food store calculator with discount logic, built with **NestJS** (backend) and **React + Vite** (frontend).

---

## Setup & Run

### Prerequisites

- Node.js >= 18

### Install

```bash
cd backend && npm install
cd ../frontend && npm install
```

### Start

```bash
# Backend (port 3001)
cd backend
npm run start:dev

# Frontend (port 5173)
cd frontend
npm run dev
```

Open http://localhost:5173

---

## Running Tests

```bash
cd backend
npm test
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Returns all products |
| POST | `/api/calculate` | Calculates order total with discounts |

### POST /api/calculate — Request

```json
{
  "items": [
    { "productId": "orange", "quantity": 2 }
  ],
  "memberCard": "MEMBER001"
}
```

