import express from 'express'
import path from 'path'
import { connectDB } from './db'
import register from './controllers/auth/register'
import config from './config'
import login from './controllers/auth/login'
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

// Routes
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Express EJS TypeScript',
    message: 'Hello from Express with EJS and TypeScript!'
  })
})

app.post('/api/auth/register', register)
app.post('/api/auth/login', login)


// Start server
app.listen(config.port, async () => {
  await connectDB()
  console.log(`Server running at http://localhost:${config.port}`)
})
