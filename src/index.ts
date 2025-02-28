import express from 'express'
import cookieParser from 'cookie-parser'
import path from 'path'
import { connectDB } from './db'
import register from './controllers/auth/register'
import config from './config'
import login from './controllers/auth/login'
import aqiView from './controllers/page/aqiView'
import loginView from './controllers/page/loginView'
import AdminView from './controllers/page/AdminView'
import { authenticate } from './middlewares/authenticated'
import createDevice from './controllers/device/createDevice'
import getDevice from './controllers/device/getDevice';
import morgan from 'morgan';
import recordAir from './controllers/air/recordAir';
// Initialize express app
const app = express()

// Set view engine
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// Serve static files
app.use(express.static(path.join(__dirname, 'public')))

// Parse JSON body
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(morgan('dev'))
// Routes
app.get('/', aqiView)
app.get('/login', loginView)
app.get('/admin', authenticate, AdminView)
// Api
app.post('/api/auth/register', register)
app.post('/api/auth/login', login)
// Device API
app.get('/api/device', getDevice)
app.post('/api/device', createDevice)

app.post('/api/air/record/:id', recordAir)
// Start server
app.listen(config.port, async () => {
  await connectDB()
  console.log(`Server running at http://localhost:${config.port}`)
})
