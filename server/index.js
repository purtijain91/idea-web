const express = require('express')
const dotenv = require('dotenv')
const cookieParser = require("cookie-parser");
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('../server/routes/authRoutes') 
const ideaRoutes = require('../server/routes/ideaRoutes')
const path = require('path')
const http = require('http')
const {initSocket} = require('./utils/socket')

dotenv.config()
const app = express();

// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }));  
// app.use(cors())
// Allow requests from frontend
app.use(
  cors({
    origin: "http://localhost:3001", // your React app
    credentials: true, // allow cookies to be sent
  })
);

app.use(cookieParser())

//multer
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//database connection
connectDB()

//routes
app.use('/api/auth',authRoutes)
app.use('/api/ideas',ideaRoutes)

const server = http.createServer(app);

initSocket(server);

const PORT = process.env.PORT || 3000

// server listen
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

