# Trading Platform

A full-stack trading platform consisting of a React frontend and Spring Boot backend, featuring real-time stock data, portfolio management, wallet functionality, and secure user authentication.

## Architecture

This project is organized into two main components:

- **trading-react/**: React frontend application
- **trading/**: Spring Boot backend API

## Features

- **User Authentication**: Secure sign up, sign in, and password recovery with JWT tokens
- **Portfolio Management**: Track investments and performance analytics
- **Stock Trading**: Real-time buy and sell operations
- **Watchlist**: Monitor favorite stocks and market trends
- **Wallet Management**: Top up, transfer funds, and withdrawal operations with Razorpay integration
- **Admin Panel**: Manage user withdrawals and platform activities
- **Email Notifications**: Automated email services for user communications
- **Responsive Design**: Mobile-friendly interface with modern UI components

## Tech Stack

### Frontend (trading-react)
- **Framework**: React 19
- **Build Tool**: Vite
- **State Management**: Redux with Redux Thunk
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Charts**: ApexCharts with React ApexCharts
- **Forms**: React Hook Form with Zod validation
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

### Backend (trading)
- **Framework**: Spring Boot 3.5.6
- **Language**: Java 21
- **Database**: MySQL
- **ORM**: Spring Data JPA with Hibernate
- **Security**: Spring Security with JWT authentication
- **Payment Gateway**: Razorpay integration
- **Email Service**: Spring Boot Mail
- **Build Tool**: Maven
- **Development Tools**: Spring Boot DevTools

## Getting Started

### Prerequisites

- **Frontend**: Node.js (version 18 or higher), npm or yarn
- **Backend**: Java 21, Maven, MySQL

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd "Trading React"
   ```

2. **Setup Backend (trading folder):**
   ```bash
   cd trading

   # Make sure MySQL is running and create database
   # CREATE DATABASE trading_platform;

   # Update database credentials in src/main/resources/application.properties
   # spring.datasource.username=your_mysql_username
   # spring.datasource.password=your_mysql_password

   # Build and run the backend
   ./mvnw spring-boot:run
   ```
   The backend will start on `http://localhost:5454`

3. **Setup Frontend (trading-react folder):**
   ```bash
   cd ../trading-react

   # Install dependencies
   npm install

   # Start the development server
   npm run dev
   ```
   The frontend will start on `http://localhost:5173`

4. **Access the application:**
   Open [http://localhost:5173](http://localhost:5173) in your browser.

## Available Scripts

### Frontend Scripts
- `npm run dev` - Start the development server
- `npm run build` - Build the app for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint for code linting

### Backend Scripts
- `./mvnw spring-boot:run` - Start the Spring Boot application
- `./mvnw clean install` - Build the application
- `./mvnw test` - Run tests

## Project Structure

### Frontend (trading-react)
```
src/
├── components/          # Reusable UI components
│   └── ui/             # Radix UI components
├── config/             # API configuration
├── lib/                # Utility libraries
├── page/               # Page components
│   ├── Auth/          # Authentication pages
│   ├── Home/          # Dashboard and home pages
│   ├── Portfolio/     # Portfolio management
│   ├── Wallet/        # Wallet operations
│   ├── Watchlist/     # Watchlist management
│   └── ...            # Other feature pages
├── State/              # Redux state management
│   ├── Store.js       # Redux store configuration
│   └── ...            # State slices
└── utils/              # Utility functions
```

### Backend (trading)
```
src/
├── main/
│   ├── java/
│   │   └── com/
│   │       └── chirag/
│   │           └── trading/
│   │               ├── config/     # Security, CORS, etc.
│   │               ├── controller/ # REST controllers
│   │               ├── model/      # JPA entities
│   │               ├── repository/ # Data repositories
│   │               ├── service/    # Business logic
│   │               └── utils/      # Utility classes
│   └── resources/
│       └── application.properties # Configuration
└── test/                          # Unit tests
```

## API Configuration

The frontend communicates with the backend API. The default API base URL is configured in `trading-react/src/config/api.js`.

## Database Setup

The application uses MySQL database. Update the connection details in `trading/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/trading_platform
spring.datasource.username=your_username
spring.datasource.password=your_password
```

## Payment Integration

The platform integrates with Razorpay for payment processing. Configure your Razorpay credentials in `application.properties`:

```properties
razorpay.api.key=your_razorpay_key
razorpay.api.secret=your_razorpay_secret
```

## Contributing

1. Fork the repository
2. Create a feature branch from `main`
3. Make your changes to either frontend or backend
4. Test both frontend and backend functionality
5. Submit a pull request

## License

This project is licensed under the MIT License.
