const express = require('express')
const bcrypt = require('bcryptjs')
const cors = require('cors')
const bodyParser = require('body-parser')
const crypto = require('crypto');
const { SERVER_PORT } = require("./constants/shared");
const { db } = require("./modules/DatabaseModule");
const { generateToken, authenticateToken } = require("./modules/JwtModule");
const { sendEmail } = require("./modules/MailerModule");


const app = express()


app.use(cors())
app.use(bodyParser.json()) // Utilisation de body-parser pour parser le JSON


// Register a new user
app.post('/register', (req, res) => {
  const { email, password } = req.body

  const hashedPassword = bcrypt.hashSync(password, 8)
  const secret = speakeasy.generateSecret().base32

  console.log(` Require to register user with email: ${email} and hashedPassword: ${hashedPassword}`)

  db.run(
    `INSERT INTO users (email, password, secret) VALUES (?, ?, ?)`,
    [email, hashedPassword, secret],
    function (err) {
      if (err) {
        console.error(` Error while registering user: ${err.message}`)
        return res.status(400).send({ message: 'User already exists' })
      }
      console.log(` User registered with id: ${this.lastID} and secret: ${secret}`)
      res.status(201).send({ message: 'User registered' })
    }
  )
})

// Login a user
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  console.log(` Require to login user with email: ${email}`)

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) {
        console.error(` Error while logging in user: ${err.message}`)
      return res.status(500).send({ message: 'Internal server error' });
    }
    if (!user || !(await bcrypt.compare(password, user.password))) {
      console.error(` Invalid credentials for user with email: ${email}`)
      return res.status(400).send({ message: 'Invalid credentials' });
    }

    const verificationCode = crypto.randomBytes(3).toString('hex');

    db.run(
        `INSERT INTO verification_codes (user_id, code) VALUES (?, ?)`,
        [user.id, verificationCode],
        async function (err) {
          if (err) {
            return res.status(500).send({ message: 'Internal server error' });
          }
          await sendEmail(user.email, 'Your verification code', `Your verification code is: ${verificationCode}`);
          res.status(200).send({ message: 'Verification code sent' });
        }
    );
  });
});

app.post('/verify', (req, res) => {
  const { email, code } = req.body;

  console.log(` Require to verify user with email: ${email} and code: ${code}`)

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err || !user) {
      console.error(` Error while verifying user: ${err}`)
      return res.status(400).send({ message: 'Invalid email' });
    }

    db.get('SELECT * FROM verification_codes WHERE user_id = ? ORDER BY created_at DESC LIMIT 1', [user.id], (err, row) => {
      if (err || !row || row.code !== code) {
        console.error(` Invalid or expired verification code for user with email: ${email}`)
        return res.status(400).send({ message: 'Invalid or expired verification code' });
      }

      const token = generateToken(user);
      res.json({ token });
    });
  });
});

app.get('/profile', authenticateToken, (req, res) => {
  res.json({ message: 'Welcome to your profile', user: req.user });
});



app.listen(SERVER_PORT, () => {
  console.log(`Server is running on port ${SERVER_PORT}. You can now send requests to http://localhost:${SERVER_PORT}`)
})
