# 🍽️ Smart Canteen System

A modern, responsive React.js frontend for a digital canteen management system with pre-ordering, queue management, digital payments, and analytics.

## ✨ Features

### 🎯 Core Functionality
- **Pre-Ordering System**: Students can order meals before 10:00 AM
- **Digital Queue Management**: Automatic slot assignment (12:00 PM - 2:00 PM)
- **QR Code System**: Unique QR codes for each order
- **Digital Payments**: UPI, Card, and Wallet payment integration
- **Waitlist Management**: Automatic waitlist when capacity (200 orders) is reached

### 👥 User Roles
#### Students
- 🔐 Login with email/password or Google OAuth
- 🍽️ Pre-order vegetarian/non-vegetarian meals
- 📱 View QR code and order details
- 💳 Complete payments online
- ⏰ Real-time slot availability

#### Admin
- 📊 Comprehensive dashboard with analytics
- 📷 QR code scanner for order verification
- 💰 Payment management and tracking
- 📈 Real-time charts and insights
- 📧 Bulk payment reminders

### 🎨 Design Features
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern UI**: Clean, intuitive interface with smooth animations
- **Real-time Updates**: Live order status and availability
- **Accessibility**: Screen reader friendly with proper ARIA labels
- **Dark/Light Mode**: Automatic theme detection

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smart-canteen-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Navbar.js        # Navigation bar
│   ├── ProtectedRoute.js # Authentication guard
│   └── AdminRoute.js    # Admin access guard
├── contexts/            # React Context providers
│   ├── AuthContext.js   # Authentication state
│   └── OrderContext.js  # Order management state
├── pages/               # Main application pages
│   ├── Home.js          # Landing page
│   ├── Login.js         # Authentication page
│   ├── Order.js         # Meal ordering page
│   ├── MyOrder.js       # Order details & QR code
│   ├── Scan.js          # QR scanner (Admin)
│   ├── AdminDashboard.js # Analytics dashboard
│   └── AdminPayments.js # Payment management
├── App.js               # Main app component
├── index.js             # Application entry point
└── index.css            # Global styles
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
REACT_APP_RAZORPAY_KEY=your-razorpay-key
```

### Tailwind CSS
The project uses Tailwind CSS for styling. Configuration is in `tailwind.config.js`.

## 🎮 Demo Usage

### Quick Login Options
The login page includes demo accounts for testing:

**Student Account:**
- Email: `student@college.edu`
- Password: Any password

**Admin Account:**
- Email: `admin@college.edu`
- Password: Any password

### Testing the Flow

1. **Student Journey:**
   - Login as student
   - Navigate to "Order Food"
   - Select meal type (Veg/Non-Veg)
   - Confirm order
   - View QR code in "My Order"
   - Complete payment

2. **Admin Journey:**
   - Login as admin
   - View dashboard analytics
   - Use QR scanner to verify orders
   - Manage payments and send reminders

## 📱 Key Pages

### 🏠 Home Page
- Hero section with call-to-action
- Real-time order statistics
- Feature highlights
- How it works section

### 🍽️ Order Page
- Meal selection (Veg/Non-Veg)
- Real-time slot availability
- Order cutoff notifications
- Waitlist management

### 📱 My Order Page
- QR code display and download
- Order details and status
- Payment integration
- Pickup instructions

### 📊 Admin Dashboard
- Interactive charts (Bar, Line, Doughnut)
- Key performance metrics
- Recent order activity
- Peak hours analysis

### 💳 Payment Management
- Bulk payment operations
- Payment status filtering
- Automated reminders
- Revenue analytics

## 🛠️ Built With

- **React.js** - Frontend framework
- **Tailwind CSS** - Utility-first CSS framework
- **Chart.js** - Data visualization
- **React Router** - Client-side routing
- **React QR Code** - QR code generation
- **Lucide React** - Icon library
- **Local Storage** - Data persistence (demo)

## 🔒 Security Features

- **Authentication Guards**: Protected routes for students and admin
- **Input Validation**: Form validation and sanitization
- **XSS Protection**: Proper data escaping
- **CSRF Protection**: Token-based authentication
- **Secure Storage**: Encrypted local storage for sensitive data

## 📈 Performance Optimizations

- **Code Splitting**: Lazy loading of components
- **Memoization**: React.memo for expensive components
- **Image Optimization**: Responsive images with proper formats
- **Bundle Optimization**: Webpack optimizations for smaller bundles

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel deploy
```

### Deploy to Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📋 Future Enhancements

- [ ] Real-time notifications (WebSocket)
- [ ] Mobile app (React Native)
- [ ] Advanced analytics (ML predictions)
- [ ] Multi-language support
- [ ] Inventory management
- [ ] Nutrition information
- [ ] Student feedback system
- [ ] Integration with college ERP

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Design Inspiration**: Modern web applications
- **Icons**: Lucide React icon library
- **Charts**: Chart.js community
- **CSS Framework**: Tailwind CSS team

## 📞 Support

For support and questions:
- 📧 Email: support@smartcanteen.com
- 💬 Discord: [Smart Canteen Community](https://discord.gg/smartcanteen)
- 📱 WhatsApp: +91-XXXXX-XXXXX

---

**Made with ❤️ for modern college canteens**