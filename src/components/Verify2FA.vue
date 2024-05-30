<template>
  <div class="verify-page">
    <div class="form">
      <h1>Verify 2FA</h1>
      <form @submit.prevent="verify2FA">
        <div class="input-container">
          <label for="token">2FA Token</label>
          <img src="/images/password-icon.png" alt="Token Icon" class="input-icon" />
          <input
            v-model="token"
            type="text"
            id="token"
            placeholder="Enter your 2FA token"
            required
          />
        </div>
        <button type="submit">Verify</button>
        <p v-if="errorMessage">{{ errorMessage }}</p>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { useRouter, useRoute } from 'vue-router'

export default {
  data() {
    return {
      token: '',
      errorMessage: ''
    }
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    return {
      route,
      router
    }
  },
  methods: {
    async verify2FA() {
      try {
        const response = await axios.post('http://localhost:3000/verify-2fa', {
          email: this.route.params.email,
          token: this.token
        })
        alert('Login successful')
        this.router.push({ name: 'HomeForm' })
      } catch (error) {
        this.errorMessage = 'Invalid 2FA code'
      }
    }
  }
}
</script>

<style scoped>
.verify-page {
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

p {
  color: rgb(78, 73, 73);
}
</style>
