🍽️ Viswa Restaurant – Full Stack Application

A complete Restaurant Ordering and Reservation Management System built with React.js (Frontend) and Spring Boot (Backend).
The application allows customers to order food online, manage cart, book tables, reserve party halls, and manage their profile.

🚀 Tech Stack
####################
Frontend

React.js

React Router

Axios (API Calls)

Context API / Redux (state management)

CSS 
#####################
Backend

Spring Boot

Spring Web

Spring Data JPA

PostgreSQL / MySQL (choose your DB)

Hibernate

Lombok

🎯 Main Features
######################
🛒 Food Ordering System

Browse food categories

View food items with details

Add items to cart

Update quantity

Remove items

Place orders

View order history

######################

👤 Customer Authentication

User Registration

Login / Logout

Profile management

Secure REST APIs with Spring Boot


📅 Restaurant Reservation

######################
🍽️ Table Booking

Select date & time

Choose table

Check availability

Book instantly

######################
🎉 Party Hall Reservation

View available party halls

Choose capacity

Book for events (birthday, meetings, celebrations)

######################
🏦 Wallet & Payments (Optional Module)

Use wallet to place orders

Track balance & transactions



📂 Project Structure
Viswa-Restaurant/
   ├── viswa-frontend/     # React.js frontend
   ├── viswa-backend/      # Spring Boot backend
   └── README.md

⚙️ Backend Setup (Spring Boot)
1️⃣ Update database credentials in

viswa-backend/src/main/resources/application.properties

spring.datasource.url=jdbc:postgresql://localhost:5432/viswa
spring.datasource.username=postgres
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update

2️⃣ Run Backend
cd viswa-backend
./gradlew bootRun


OR from IntelliJ/Eclipse → Run ViswabackendApplication.java

💻 Frontend Setup (React.js)
1️⃣ Install Dependencies
cd viswa-frontend
npm install

2️⃣ Start Development Server
npm start


Frontend will run at:
👉 http://localhost:3000

🔗 API Communication

Frontend uses Axios to communicate with backend endpoints like:

/api/auth/login

/api/food

/api/cart

/api/orders

/api/reserve/table

/api/reserve/partyhall


🧪 Testing

Backend tests located at:

viswa-backend/src/test/


Run all tests:

./gradlew test

🚀 Deployment Options

Frontend → Netlify / Vercel / Nginx

Backend → Render / Railway / AWS EC2

Database → PostgreSQL on Railway / AWS RDS

🙌 Contributors

👤 Vishal Kapoor
Full Stack Developer (React + Spring Boot)

⭐ If you like this project, give it a star on GitHub!
