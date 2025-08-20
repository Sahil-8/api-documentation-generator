# API Documentation Generator

A full-stack web application that allows developers to upload API definition files (Swagger/OpenAPI, Postman, YAML, JSON, or Markdown) and automatically generates clean, human-readable documentation with PDF export capabilities.

## 🌟 Features

- 🔐 **Secure Authentication** - JWT-based user registration, login, and password change system
- 📁 **Multi-Format Support** - Upload and parse Swagger/OpenAPI, Postman, YAML, JSON, or Markdown files
- 🔄 **Automatic Parsing** - Intelligent extraction of endpoints, schemas, and documentation details
- 📊 **Interactive Documentation Viewer** - Clean, organized display of parsed API documentation
- 📄 **PDF Export** - Generate downloadable PDF documentation
- 🎨 **Modern UI/UX** - Beautiful, responsive interface built with React and Tailwind CSS
- 🔒 **Protected Routes** - Secure dashboard access with authentication
- 📱 **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- 🚀 **Production Ready** - Deployed on Vercel (frontend) and Render (backend)
- 🔄 **Password Management** - Change password functionality with validation

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with latest features
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Fetch API** - HTTP client for API calls
- **@tailwindcss/typography** - Enhanced typography styles

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **Multer** - File upload handling
- **Swagger-Parser** - OpenAPI/Swagger file parsing
- **js-yaml** - YAML file parsing
- **Marked** - Markdown parsing
- **html-pdf** - PDF generation
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/Sahil-8/api-documentation-generator.git
cd api-documentation-generator
```

### 2. Backend Setup

Navigate to the backend directory:
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
MONGO_URI=mongodb://localhost:27017/api-docs-generator
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/api-docs-generator

PORT=5000
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
```

Start the backend server:
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The backend will be available at `http://localhost:5000`

### 3. Frontend Setup

Navigate to the frontend directory:
```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start the frontend development server:
```bash
npm start
```

The frontend will be available at `http://localhost:3000`

## 🚀 Deployment

### Frontend Deployment (Vercel)

1. **Build the project:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Vercel:**
   - Connect your GitHub repository to Vercel
   - Set build command: `npm run build`
   - Set publish directory: `build`
   - Add environment variables in Vercel dashboard:
     ```
     REACT_APP_API_URL=https://your-backend-url.onrender.com/api
     ```

3. **Configure redirects:**
   The `frontend/vercel.json` file handles SPA routing automatically.

### Backend Deployment (Render)

1. **Connect your repository to Render**
2. **Create a new Web Service**
3. **Configure the service:**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment Variables:
     ```
     MONGO_URI=your_mongodb_atlas_connection_string
     JWT_SECRET=your_jwt_secret
     NODE_ENV=production
     ```

## 📖 Usage

### 1. Authentication
- Register a new account or login with existing credentials
- JWT tokens are automatically handled for authenticated requests
- Use the "Change Password" feature to update your password

### 2. File Upload
- Navigate to the dashboard
- Upload API definition files (Swagger/OpenAPI, Postman, YAML, JSON, or Markdown)
- Files are automatically parsed and stored

### 3. View Documentation
- Browse uploaded files in the dashboard
- Click on any file to view the parsed documentation
- Documentation is displayed in a clean, organized format

### 4. Export PDF
- Generate downloadable PDF versions of your documentation
- PDFs include all parsed endpoints, schemas, and descriptions

### 5. Change Password
- Click the "Change Password" button in the dashboard
- Enter your current password and new password
- Confirm the new password and submit

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/change-password` - Change user password (requires authentication)

### File Management
- `POST /api/upload` - Upload and parse API definition files
- `POST /api/upload/generate-pdf` - Generate PDF from parsed data

### Health Check
- `GET /health` - Backend health status
- `GET /` - Root endpoint status

## 📁 Project Structure

```
api-documentation-generator/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── uploadController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── uploads/
│   ├── app.js
│   ├── render.yaml
│   └── package.json
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   ├── favicon.svg
│   │   └── _redirects
│   ├── src/
│   │   ├── components/
│   │   │   ├── Home.js
│   │   │   └── DocumentationViewer.js
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   └── ChangePassword.js
│   │   ├── utils/
│   │   │   └── apiTest.js
│   │   ├── App.js
│   │   └── index.js
│   ├── vercel.json
│   └── package.json
├── vercel.json
└── README.md
```

## 🔧 Environment Variables

### Backend (.env)
```env
MONGO_URI=mongodb://localhost:27017/api-docs-generator
PORT=5000
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

### API Testing
Use the included test files in `backend/test/` to test different file formats:
- `test-swagger.json` - Swagger/OpenAPI specification
- `test-postman.json` - Postman collection
- `test-openapi.yaml` - OpenAPI YAML format
- `test-docs.md` - Markdown documentation

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcryptjs for secure password storage
- **CORS Protection** - Configured for cross-origin requests
- **Input Validation** - Server-side validation for all inputs
- **Error Handling** - Comprehensive error handling and logging

## 🚀 Performance Features

- **File Upload Optimization** - Efficient file handling with Multer
- **PDF Generation** - Server-side PDF generation for documentation
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Code Splitting** - React Router for efficient page loading

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the existing issues in the repository
2. Create a new issue with detailed information
3. Include error messages and steps to reproduce

## 🔄 Updates & Maintenance

- Keep dependencies updated regularly
- Monitor MongoDB Atlas usage and costs
- Check Vercel and Render deployment status
- Review and update environment variables as needed

## 📊 Monitoring

- **Uptime Monitoring** - Use Uptime Robot to monitor your deployed services
- **Error Tracking** - Check Vercel and Render logs for errors
- **Performance Monitoring** - Monitor API response times and user experience

## 🎯 Roadmap

- [ ] Add user profile management
- [ ] Implement file versioning
- [ ] Add collaborative editing features
- [ ] Support for more file formats
- [ ] Advanced PDF customization options
- [ ] API rate limiting
- [ ] User activity analytics

---
