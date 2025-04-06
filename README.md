# Car Rental Application

A full-stack car rental management system built with AngularJS, Node.js, Express, and MongoDB.

## Features

- User Authentication (Login/Register)
- Role-based Access Control (Admin/User)
- Car Management System
- Profile Management
- Responsive Design

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd car-rental-application
```

2. Install dependencies
```bash
npm install
```

3. Set up MongoDB
- Make sure MongoDB is running on your system
- The application will connect to `mongodb://localhost:27017/carRental`

4. Create admin user
```bash
node scripts/createAdmin.js
```

## Running the Application

Start the application:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Change Admin Creds in ``` script/createAdmin.js ```

## Project Structure

```
├── config/
│   └── database.js
├── controllers/
│   ├── carController.js
│   └── homeController.js
├── models/
│   ├── Car.js
│   └── User.js
├── views/
│   ├── admin.html
│   ├── cars.html
│   ├── home.html
│   ├── login.html
│   ├── profile.html
│   └── register.html
├── scripts/
│   └── createAdmin.js
├── app.js
├── server.js
└── package.json
```

## API Endpoints

### Authentication
- POST `/api/login` - User login
- POST `/api/register` - User registration
- POST `/api/logout` - User logout

### Cars
- GET `/api/cars` - Get all cars
- POST `/api/cars` - Add new car (Admin only)
- DELETE `/api/cars/:id` - Delete car (Admin only)

## Features

### User Features
- Browse available cars
- Sort cars by price and name
- View car details
- Register and login
- View profile

### Admin Features
- All user features
- Add new cars
- Delete existing cars
- Access admin dashboard

## Security Features

- Password hashing using bcrypt
- JWT-based authentication
- HTTP-only cookies
- Role-based access control
- Input validation
- MongoDB injection prevention

## Technologies Used

- Frontend:
  - AngularJS
  - Bootstrap 4
  - HTML5/CSS3
  
- Backend:
  - Node.js
  - Express.js
  - MongoDB
  - Mongoose
  
- Authentication:
  - JWT (jsonwebtoken)
  - bcryptjs

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
