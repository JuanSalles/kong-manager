<template>
  <PageHeader
    :title="isEditing ? t('entities.admin-users.updatePassword.form.title') : t('entities.admin-users.create.form.title')"
  />
  <UserFormComponent
    :config="adminUsersFormConfig"
    :user-id="id"
    :username="username"
    @update="handleUpdate"
  />
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useFormGeneralConfig } from '@/composables/useFormGeneralConfig'
import { useFormRedirectOnCancel, useFormRedirectOnUpdate } from '@/composables/useFormRedirect'
import { useToaster } from '@/composables/useToaster'
import { useI18n } from '@/composables/useI18n'
import UserFormComponent from '@/components/UserFormComponent.vue'

defineOptions({
  name: 'AdminUsersForm',
})

const route = useRoute()
const router = useRouter()
const toaster = useToaster()
const { t } = useI18n()

const id = computed(() => (route.params.id as string) ?? '')
const username = computed(() => (route.params.username as string) ?? '')
const isEditing = computed(() => !!id.value)

const routeOnCancel = useFormRedirectOnCancel(
  { name: 'admin-users' },
)

const routeOnUpdate = useFormRedirectOnUpdate(
  { name: 'admin-users' },
)

const adminUsersFormConfig = reactive({
  ...useFormGeneralConfig(),
  cancelRoute: routeOnCancel,
})

const handleUpdate = (entity) => {
  router.push(routeOnUpdate)
  toaster.open({
    appearance: 'success',
    message: t(
      isEditing.value ? 'entities.admin-users.updated' : 'entities.admin-users.created',
      { username: entity.username },
    ),
  })
}
</script>
