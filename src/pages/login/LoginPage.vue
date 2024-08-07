<template>
  <div class="login">
    <h1>Login</h1>
    <form @submit.prevent="submitForm">
      <label for="username">Username:</label>
      <input
        type="text"
        id="username"
        v-model="username"
        required
      >
      <label for="password">Password:</label>
      <input
        type="password"
        id="password"
        v-model="password"
        required
      >
      <button type="submit">
        Entrar
      </button>
      <div
        class="errorMsg"
        v-if="errorMsg"
      >
        {{ errorMsg }}
      </div>
    </form>
  </div>
</template>

<script>
import { authService } from '@/services/authService'

export default {
  name: 'LoginPage',
  data() {
    return {
      username: '',
      password: '',
      errorMsg: null,
    }
  },
  methods: {
    async submitForm() {
      try {
        const data = {
          username: this.username,
          password: this.password,
        }
        const res = await authService.login(data)
        if (res.status != 200) {
          this.errorMsg = res.data.message
        } else {
          window.location.reload()
        }
      } catch (error) {
        this.errorMsg = error.response.data.message ? error.response.data.message : error.message
      }
    },
  },
}
</script>

<style scoped>
.login {
  max-width: 400px;
  margin: 50px auto 0;
  padding: 20px;
  border: none;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  font-weight: 600;
  font-size: 2rem;
}

form {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 10px;
  font-size: 0.9rem;
  font-weight: 500;
  color: rgb(108, 116, 137);
}

input {
  padding: 10px;
  margin-bottom: 20px;
  border: none;
  border-radius: 6px;
  background-color: rgb(241, 241, 241);
}

input:focus {
  outline: none;
  background-color: rgb(245, 245, 245);
}
button{
  font-family: "Inter", Roboto, Helvetica, sans-serif;
  font-size: 16px;
  font-weight: 700;
  padding: 10px 20px;
  margin-bottom: 15px;
  background-color: #0044f4;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  text-decoration: none;
  display: flex;
  justify-content: center;
  gap: 10px;
  align-items: center;
}

button:hover {
  background-color: #0039d1;
  text-decoration: none;
}

.errorMsg {
  color: #d60027;
  font-weight: 500;
  margin-top: 10px;
}
</style>