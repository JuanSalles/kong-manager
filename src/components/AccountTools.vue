<template>
  <div>
    <div
      class="menu-account"
      v-if="isUserLoggedIn"
      :class="{ 'menuActive': isActive }"
    >
      <div
        class="account-tools"
        :class="{ 'active': isActive }"
        @click="isActive = !isActive"
      >
        <span>{{ username }}</span>
      </div>
      <ul>
        <li>
          <router-link
            :to="{ name: 'admin-user-create', params: { id, username } }"
            title="go to change password"
          >
            Change Password
          </router-link>
        </li>
        <li
          @click="handleLogout"
        >
          Logout
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { authService } from '@/services/authService'

export default {


  data() {
    return {
      isUserLoggedIn: false,
      id: null,
      username: null,
      isActive: false,
    }
  },
  async created() {
    this.isUserLoggedIn = await this.checkUserAuthentication()
  },
  methods: {
    async checkUserAuthentication() {
      try {
        const response = await authService.session_user_id()

        if (response.status === 200) {
          this.id = response.data.id
          this.username = response.data.username
          return true
        }
        return false
      } catch (error) {
        console.log('Usuario nao autenticado')
        return false
      }
    },

    handleLogout() {
      authService.logout()
        .then(() => {
          window.location.reload()
        })
        .catch(() => {
          console.error('Erro ao fazer logout')
        })
    },
  },
}
</script>
<style scoped lang="scss">
.menu-account {
  display: flex;
  width: 240px;
  flex-direction: column;
  justify-content: flex-start;
  margin-left: 12px;
  margin-bottom: 20px;
  color: #bee2ff;
  font-size: 14px;
  font-weight: 500;
  background-color: none;
  transition: background-color 0.2s ease;
}

.menu-account:hover {
  color: #eefaff;
}
.account-tools {
  width: calc(100% - 12px);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  cursor: pointer;
  padding-left: 24px;
}

ul{
  padding-left: 26px;
  width: calc(100% - 12px);
  height: 0;
  overflow: hidden;
  transition: height 0.8s ease;
}

.active ~ ul{
  height: 70px;
}

li{
  cursor: pointer;
  padding: 10px 10px 0 10px;
  font-size: 14px;
  color: #bee2ff;
}

li:hover{
  color: #eefaff;
}

a{
  color: #bee2ff;
  text-decoration: none;
}

a:link {
  text-decoration:none;
}

a:hover{
  color: #eefaff;
  text-decoration: none;
}

.menuActive{
  background: #ffffff1f;
  border-radius: 6px;
  border: 1px solid #ffffff1f;
}

.active{
  color: #00fabe;
  height: 48px;
  border-bottom: 1px solid #ffffff1f;
}
</style>