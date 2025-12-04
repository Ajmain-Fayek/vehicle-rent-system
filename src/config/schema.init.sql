CREATE TYPE IF NOT EXISTS user_role AS ENUM ('admin', 'customer');
-- User Table
CREATE TABLE IF NOT EXISTS Users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone TEXT NOT NULL,
  role user_role DEFAULT 'customer'
);

CREATE TYPE IF NOT EXISTS vehicle_type AS ENUM ('car', 'bike', 'van', 'SUV');
CREATE TYPE IF NOT EXISTS availability_status AS ENUM ( 'available', 'booked' );
-- Vehicle Table
CREATE TABLE IF NOT EXISTS Vehicles (
  id SERIAL PRIMARY KEY,
  vehicle_name VARCHAR(150) NOT NULL,
  type vehicle_type NOT NULL,
  registration_number TEXT UNIQUE NOT NULL,
  daily_rent_price DECIMAL(10, 2) NOT NULL,
  availability_status availability_status NOT NULL,

  CONSTRAINT positive CHECK( daily_rent_price > 0 )
);

CREATE TYPE IF NOT EXISTS booking_status AS ENUM ('active', 'cancelled', 'returned');
--  Booking status
CREATE TABLE IF NOT EXISTS Bookings (
  id SERIAL PRIMARY KEY,
  customer_id INT NOT NULL,
  vehicle_id INT NOT NULL,
  rent_start_date DATE NOT NULL,
  rent_end_date DATE NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status booking_status NOT NULL,

  CONSTRAINT after_start CHECK(rent_end_date > rent_start_date),
  CONSTRAINT fk_user FOREIGN KEY(customer_id) REFERENCES Users(id) ON DELETE CASCADE,  
  CONSTRAINT fk_vehicle FOREIGN KEY(vehicle_id) REFERENCES Vehicles(id) ON DELETE CASCADE  
);