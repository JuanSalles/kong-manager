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
        Login
      </button>
    </form>
  </div>
</template>

<script>
import axios from 'axios'
import Cookies from 'js-cookie'
export default {
  name: 'LoginPage',
  data() {
    return {
      username: '',
      password: '',
    }
  },
  methods: {
    async submitForm() {
      try {
        // Substitua 'http://seu-backend.com/api/login' pelo seu endpoint real
        const response = await axios.post('http://localhost:4000', {
          username: this.username,
          password: this.password,
        })

        // Supondo que o backend retorne o token JWT em response.data.token
        const token = response.data.token

        // Salva o token JWT nos cookies com o nome 'km_token'
        Cookies.set('km_token', token) // O token epira por sessao

        // Redirecionar o usuário para a página inicial ou dashboard após o login
        this.$router.push({ name: 'overview' })
      } catch (error) {
        console.error('Erro ao fazer login')
        // Tratar erro de login aqui (ex: mostrar mensagem de erro)
      }
    },
  },
}
</script>

<style scoped>
.login {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

h1 {
  text-align: center;
}

form {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 10px;
}

input {
  padding: 10px;
  margin-bottom: 20px;
}

button {
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>