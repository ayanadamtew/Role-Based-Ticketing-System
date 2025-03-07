# Role-Based Ticketing System

A full-stack web application for managing support tickets with role-based access control.

## Features

- User authentication (JWT-based login & signup)
- Role-based access control (User and Admin roles)
- Create, view, and manage support tickets
- Admin dashboard for ticket management
- Responsive design

## Technologies Used

### Backend
- **Node.js** - JavaScript runtime for building the backend server
- **Express.js** - Web application framework for Node.js
- **MongoDB with Mongoose** - NoSQL database and ODM for MongoDB
- **JSON Web Tokens (JWT)** - Secure authentication method for login and signup

### Frontend
- **React.js** - JavaScript library for building user interfaces
- **Redux** - State management library for managing global state
- **React Router** - For navigating between pages in a single-page application
- **Bootstrap** - Framework for responsive and mobile-first web design

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or later)
- **MongoDB** (local or cloud-based instance)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/role-based-ticketing-system.git
   ```

2. Navigate to the project directory:

   ```bash
   cd role-based-ticketing-system
   ```

3. Install backend dependencies:

   ```bash
   cd backend
   npm install
   ```

4. Install frontend dependencies:

   ```bash
   cd frontend
   npm install
   ```

### Configuration

1. Create a `.env` file in the `backend` directory and add the following environment variables:

   ```bash
   MONGO_URI=your_mongo_database_uri
   JWT_SECRET=your_jwt_secret
   ```

2. Replace `your_mongo_database_uri` with your MongoDB connection string and `your_jwt_secret` with a secure string for signing JWT tokens.

### Running the Application

1. Start the backend server:

   ```bash
   cd backend
   npm start
   ```

2. Start the frontend development server:

   ```bash
   cd frontend
   npm start
   ```

The application should now be running at `http://localhost:3000`.

## Usage

- **User Role:** Allows users to create and view their support tickets.
- **Admin Role:** Allows admins to manage and view all tickets and handle user requests.

### Example Routes

- **POST /api/auth/register** - Register a new user
- **POST /api/auth/login** - Login to the system
- **GET /api/tickets** - Get all tickets (Admin only)
- **POST /api/tickets** - Create a new ticket
- **GET /api/tickets/:id** - View a specific ticket
