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

---

## 🌐 API Endpoints

### Authentication
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/v1/auth/signup` | Public | Register new user account |
| POST | `/api/v1/auth/signin` | Public | Login and receive JWT token |

---

### Vehicles
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/v1/vehicles` | Admin only | Add new vehicle with name, type, registration, daily rent price and availability status |
| GET | `/api/v1/vehicles` | Public | View all vehicles in the system |
| GET | `/api/v1/vehicles/:vehicleId` | Public | View specific vehicle details |
| PUT | `/api/v1/vehicles/:vehicleId` | Admin only | Update vehicle details, daily rent price or availability status |
| DELETE | `/api/v1/vehicles/:vehicleId` | Admin only | Delete vehicle (only if no active bookings exist) |

---

### Users
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/v1/users` | Admin only | View all users in the system |
| PUT | `/api/v1/users/:userId` | Admin or Own | Admin: Update any user's role or details<br>Customer: Update own profile only |
| DELETE | `/api/v1/users/:userId` | Admin only | Delete user (only if no active bookings exist) |

---

### Bookings
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/v1/bookings` | Customer or Admin | Create booking with start/end dates<br>• Validates vehicle availability<br>• Calculates total price (daily rate × duration)<br>• Updates vehicle status to "booked" |
| GET | `/api/v1/bookings` | Role-based | Admin: View all bookings<br>Customer: View own bookings only |
| PUT | `/api/v1/bookings/:bookingId` | Role-based | Customer: Cancel booking (before start date only)<br>Admin: Mark as "returned" (updates vehicle to "available")<br>System: Auto-mark as "returned" when period ends |
