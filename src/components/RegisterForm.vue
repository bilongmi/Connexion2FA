<template>
  <div class="register-page">
    <div class="form">
      <h1>Register</h1>
      <form @submit.prevent="register">
        <div class="input-container">
          <label for="email">E-mail</label>
          <img src="/images/user_icon.png" alt="Email Icon" class="input-icon" />
          <input v-model="email" type="email" id="email" placeholder="Type your email" required />
        </div>
        <div class="input-container">
          <label for="password">Password</label>
          <img src="/images/password-icon.png" alt="Password Icon" class="input-icon" />
          <input
            v-model="password"
            type="password"
            id="password"
            placeholder="Type your password"
            required
          />
        </div>
        <button type="submit">Register</button>
        <p v-if="errorMessage">{{ errorMessage }}</p>
      </form>
      <p class="message">Already a user? <router-link to="/login">Login</router-link></p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { useRouter } from 'vue-router'

export default {
  data() {
    return {
      email: '',
      password: '',
      errorMessage: ''
    }
  },
  setup() {
    const router = useRouter()
    return {
      router
    }
  },
  methods: {
    async register() {
      try {
        await axios.post('http://localhost:3000/register', {
          email: this.email,
          password: this.password
        })
        this.router.push({ name: 'LoginForm' })
      } catch (error) {
        this.errorMessage = 'User already exists'
      }
    }
  }
}
</script>

<style scoped>
.register-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.form {
  background: #fff;
  padding: 20px;
  max-width: 360px;
  width: 100%;
  text-align: center;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

h1 {
  margin-bottom: 20px;
  font-weight: 1000;
  font-size: 30px;
}

.input-container {
  position: relative;
  margin: 20px 0;
  text-align: left;
}

.input-container label {
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
  font-weight: 600;
}

.input-icon {
  position: absolute;
  top: 63%;
  left: 10px;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
}

input {
  font-size: 16px;
  padding: 15px 15px 15px 40px;
  margin: 10px 0;
  width: calc(100% - 30px);
  border: none;
  border-bottom: 2px solid #ccc;
  border-radius: 0;
  font-size: 14px;
}

input::placeholder {
  font-size: 12px;
}

input:focus {
  outline: none;
  border-bottom: 2px solid #2575fc;
}

button {
  width: 90%;
  background: linear-gradient(to right, #e943a9, #3c0fb6);
  border: none;
  padding: 10px;
  color: white;
  font-size: 13px;
  border-radius: 20px;
  cursor: pointer;
  margin: 10px 0;
}

button:hover {
  background: linear-gradient(to right, #f938cf, #8b43e9);
}

.message {
  margin: 15px 0;
}

.message a {
  color: #2575fc;
  text-decoration: none;
}

p {
  color: rgb(78, 73, 73);
}
</style>
