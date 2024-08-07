<template>
  <div>
    <PageHeader :title="t('entities.admin-users.list.title')">
      <template #below-title>
        <SupportText>
          {{ t('entities.admin-users.description') }}
        </SupportText>
      </template>
    </PageHeader>
    <div class="table_container">
      <div class="table_header">
        <router-link
          class="button button-create-user"
          to="/admin-users/create"
        >
          <span style="font-size: 30px; position: relative; bottom: 1px; font-weight: 400;">&plus;</span> {{ t('entities.admin-users.create.form.title') }}
        </router-link>
      </div>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>ID</th>
            <th>Data de criação</th>
            <th>Ultima atualização</th>
            <th />
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in userList"
            :key="user.id"
          >
            <td><strong>{{ user.username }}</strong></td>
            <td>{{ user.id }}</td>
            <td>{{ user.created_at }}</td>
            <td>{{ user.updated_at }}</td>
            <td>
              <button
                class="delete_button"
                v-if="user.deletable"
                @click="openModal(user.id)"
              >
                Delete
              </button>
              <span v-else />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div
    v-if="isModalVisible"
    class="modal"
  >
    <div class="modal-content">
      <span
        class="close"
        @click="closeModal"
      >&times;</span>
      <p>Tem certeza que deseja deletar o usuario?</p>
      <div class="modal-button-container">
        <button
          data-yes
          @click="confirmDelete"
        >
          Sim
        </button>
        <button @click="closeModal">
          Não
        </button>
      </div>
    </div>
  </div>
</template>

<script>

import { apiService } from '@/services/apiService'
import { useI18n } from '@/composables/useI18n'
import { format } from 'date-fns'

export default {
  name: 'UserPage',
  setup() {
    const { t } = useI18n()

    return {
      t,
    }
  },
  data() {
    return {
      isModalVisible: false,
      userIdToDelete: null,
      userList: [],
    }
  },
  async mounted() {
    /*
    this.userList = [
      {
        id: 11234124123,
        username: 'admin',
        created_at: this.setDate('2024-07-23 16:10:47.968578+00'),
        updated_at: this.setDate('2024-07-23 16:10:47.968578+00'),
        deletable: true,
      },
      {
        id: 2213123123123,
        username: 'admin',
        created_at: this.setDate('2024-07-23 16:10:47.968578+00'),
        updated_at: this.setDate('2024-07-23 16:10:47.968578+00'),
        deletable: true,
      },
    ]
    */
    // /*
    const res = await apiService.findAll('admin_users/list')
    if (res.status === 200) {
      this.userList = res.data.map(user => ({
        id: user.id,
        username: user.username,
        created_at: this.setDate(user.created_at),
        updated_at: user.updated_at === '' ? '' : this.setDate(user.updated_at),
        deletable: user.deletable,
      }))
    }
    // */
  },
  methods: {
    removeUserFromList(userId) {
      this.userList = this.userList.filter(user => user.id !== userId)
    },
    openModal(userId) {
      this.userIdToDelete = userId
      this.isModalVisible = true
    },
    closeModal() {
      this.isModalVisible = false
      this.userIdToDelete = null
    },
    async confirmDelete() {
      const res = await apiService.deleteRecord('admin_users', this.userIdToDelete)

      if (res.status === 200) {
        this.removeUserFromList(this.userIdToDelete)
      } else {
        console.error('Erro ao deletar usuário')
      }
      this.closeModal()
    },
    setDate(date) {
      const cleanedDateString = date.replace(/(\+\d{2}:\d{2}|\+\d{2})$/, '')
      try {
        return format(new Date(cleanedDateString), 'dd/MM/yyyy HH:mm')
      } catch (error) {
        console.error('Erro ao formatar data', error)
        return date
      }
    },

  },
}
</script>

<style>
.table_container {
    padding: 20px;
    border: 1px solid #e0e4ea;
    border-radius: 6px;
}

.table_header {
    display: flex;
    justify-content: end;
    align-items: center;
    width: 100%;
  }

.button-create-user{
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
  justify-content: space-between;
  gap: 10px;
  align-items: center;
}

.button-create-user:hover {
  background-color: #0039d1;
  text-decoration: none;
}
table {
    font-family: "Inter", Roboto, Helvetica, sans-serif;
    font-size: 14px;
    width: 100%;
    border-collapse: collapse;
}

th{
  color: rgb(108, 116, 137);
}

th, td {
    padding: 8px;
    text-align: center;
    border-bottom: 1px solid #ddd;
}

.delete_button {
    padding: 5px 20px;
    background-color: transparent;
    border: none;
    font-family: "Inter", Roboto, Helvetica, sans-serif;
    font-weight: 500;
    color: #d60027;
    cursor: pointer;
    transition: background-color 0.1s ease 0.1s;
    border-radius: 6px;
}

.delete_button:hover {
    background-color: #fed1d1;
}


.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #fefefe;
  padding: 20px;
  border: 1px solid #888;
  width: 300px;
  text-align: center;
}

.modal-button-container{
  display: flex;
  justify-content: space-between;
  padding: 20px 40px 0;
  width: 100%;
}

.modal-button-container button {
  padding: 10px 20px;
  background-color: #d60027;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.modal-button-container button:hover {
  background-color: #a8001f;
}

.modal-button-container button[data-yes] {
  background-color: #858585;
}

.modal-button-container button[data-yes]:hover {
  background-color: #6b6b6b;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

</style>
