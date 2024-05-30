const express = require('express')
const sqlite3 = require('sqlite3').verbose()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const speakeasy = require('speakeasy')
const cors = require('cors')
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer')

const app = express()
const PORT = 3000

app.use(cors())
app.use(bodyParser.json())

// Informations d'authentification email prédéfinies
const emailAuth = 'mraymondmiller08@gmail.com'
const emailPassword = 'mdp1603'

// Initialize SQLite database
const db = new sqlite3.Database('./users.db', (err) => {
  if (err) {
    console.error(err.message)
  } else {
    console.log('Connected to the SQLite database.')
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT,
      secret TEXT
    )`)
  }
})

// Register a new user
app.post('/register', (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).send({ message: 'Email and password are required' })
  }

  db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
    if (user) {
      return res.status(400).send({ message: 'User already exists' })
    }

    const hashedPassword = bcrypt.hashSync(password, 8)
    const secret = speakeasy.generateSecret().base32

    db.run(
      `INSERT INTO users (email, password, secret) VALUES (?, ?, ?)`,
      [email, hashedPassword, secret],
      function (err) {
        if (err) {
          return res.status(400).send({ message: 'User already exists' })
        }
        res.status(201).send({ message: 'User registered' })
      }
    )
  })
})

// Login a user
app.post('/login', (req, res) => {
  const { email, password } = req.body

  db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
    if (err || !user || !bcrypt.compareSync(password, user.password)) {
      console.error('Login failed: Invalid email or password')
      return res.status(400).send({ message: 'Invalid email or password' })
    }

    const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' })

    // Generate a 2FA token
    const otp = speakeasy.totp({
      secret: user.secret,
      encoding: 'base32'
    })

    // Configure nodemailer with predefined email credentials
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailAuth,
        pass: emailPassword
      }
    })

    // Send 2FA token via email
    const mailOptions = {
      from: emailAuth,
      to: email,
      subject: 'Your 2FA Code',
      text: `Your 2FA code is: ${otp}`
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending 2FA email:', error)
        return res.status(500).send({ message: 'Failed to send 2FA code' })
      } else {
        console.log('2FA email sent:', info.response)
        res.status(200).send({ token })
      }
    })
  })
})

// Verify 2FA token
app.post('/verify-2fa', (req, res) => {
  const { email, token } = req.body

  db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
    if (err || !user) {
      console.error('2FA verification failed: Invalid email')
      return res.status(400).send({ message: 'Invalid email' })
    }

    const verified = speakeasy.totp.verify({
      secret: user.secret,
      encoding: 'base32',
      token
    })

    if (verified) {
      res.status(200).send({ message: '2FA verified' })
    } else {
      console.error('2FA verification failed: Invalid 2FA code')
      res.status(400).send({ message: 'Invalid 2FA code' })
    }
  })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
