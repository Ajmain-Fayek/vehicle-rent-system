## 🚗 Vehicle Rental Management System (Backend)

A complete backend API for managing vehicles, booking, users, and role-based access control. Built with **Node.js**, **Express**, **TypeScript**, **PostgreSQL**, and **JWT** Authentication.

---

### 🚀 Live Deployment

- **API Base URL**: <https://vehicle-rental-system-liart.vercel.app>

---

### ✨ Features

#### 🧑‍💻 User Management

- User registration and login
- JWT-based authentication
- User-based roles (**admin**, **customer**)
- Admin can manage users

#### 🚛 Vehicle Management

- Add, update, & delete vehicles (**Admin only**)
- Availability tracking: **available** / **booked**

#### 📅 Booking System

- Authenticated users vehicles
- Validates availability
- Calculates rental days
- Updates vehicle status automatically
- Retrieves user's booking & rental details
- Admin can mark booking as returned
- API for simple prevents invalid actions

#### 🔒 Security

- Encrypted passwords
- Protecting routes using JWT
- Role-based middleware for authorization

---

### 🛠️ Technology Stack

| Label          | Technology         |
| :------------- | :----------------- |
| Language       | TypeScript         |
| Runtime        | Node.js            |
| Framework      | Express.js         |
| Database       | PostgreSQL         |
| Auth           | JWT                |
| ORM / Querying | Pg (node-postgres) |
| Deployment     | Vercel             |
| Job Scheduler  | node-cron          |

---

### ⚙️ Setup & Usage Instructions

#### Clone the Repository

```bash
git clone https://github.com/Ajmain-Fayek/vehicle-rent-system.git

cd vehicle-rent-system

code .
```

#### Install Dependencies

```bash
npm install
```

#### Config .env

```.env
NODE_ENV=development
PORT=5000
DB_URL=<PostgreSQL-DB_URL>
SALT_ROUNDS=10
```

#### Run the dev server

```bash
npm run dev
```

#### Build the project for Production

```bash
npm run build
```

#### Start the production server

```bash
npm run start
```
