const express = require('express')
const sqlite3 = require('sqlite3').verbose()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const speakeasy = require('speakeasy')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()
const PORT = 3000

app.use(cors())
app.use(bodyParser.json()) // Utilisation de body-parser pour parser le JSON

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

// Login a user
app.post('/login', (req, res) => {
  const { email, password } = req.body

  db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
    if (err || !user || !bcrypt.compareSync(password, user.password)) {
      return res.status(400).send({ message: 'Invalid email or password' })
    }

    const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' })
    res.status(200).send({ token })
  })
})

// Verify 2FA token
app.post('/verify-2fa', (req, res) => {
  const { email, token } = req.body

  db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
    if (err || !user) {
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
      res.status(400).send({ message: 'Invalid 2FA code' })
    }
  })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
