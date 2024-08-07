<template>
  <div class="kong-ui-entities-create-users-form">
    <EntityBaseForm
      :can-submit="canSubmit"
      :config="config"
      :user-id="userId"
      :username="username"
      :error-message="form.errorMessage"
      :form-fields="requestBody"
      :is-readonly="form.isReadonly"
      @cancel="handleClickCancel"
      @fetch:error="(err: any) => $emit('error', err)"
      @fetch:success="initForm"
      @loading="(val: boolean) => $emit('loading', val)"
      @submit="saveFormData"
    >
      <EntityFormSection
        :description="t('entities.admin-users.create.form.description')"
        :title="t('entities.admin-users.session.form.title')"
      >
        <KInput
          v-model.trim="form.fields.username"
          type="text"
          class="certificate-form-textarea"
          :label="props.userId?'Username':'New Username'"
          :readonly="props.userId?true:false"
          required
        />
        <KInput
          v-model.trim="form.fields.password"
          autocomplete="off"
          :label="'Password'"
          :readonly="form.isReadonly"
          type="password"
          required
        />
        <KInput
          v-model.trim="form.fields.newPassword"
          v-if="props.userId?true:false"
          autocomplete="off"
          :label="'New Password'"
          :readonly="form.isReadonly"
          type="password"
          required="props.userId?true:false"
        />
        <KInput
          v-model.trim="form.fields.repassword"
          autocomplete="off"
          :label="'Re-enter Password'"
          :readonly="form.isReadonly"
          type="password"
          required
        />
      </EntityFormSection>
    </EntityBaseForm>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, type PropType } from 'vue'
import { useRouter } from 'vue-router'
import type { AxiosError, AxiosResponse } from 'axios'
import { useErrors, EntityFormSection, EntityBaseForm, EntityBaseFormType, type BaseFormConfig } from '@kong-ui-public/entities-shared'
import '@kong-ui-public/entities-shared/dist/style.css'
import { useI18n } from '@/composables/useI18n'
import { apiService } from '@/services/apiService'
import type { KongManagerCertificateFormConfig } from '@kong-ui-public/entities-certificates'

const emit = defineEmits<{
  (e: 'update', data: Record<string, any>): void,
  (e: 'error', error: AxiosError): void,
  (e: 'loading', isLoading: boolean): void,
}>()

const props = defineProps({
  config: {
    type: Object as PropType<KongManagerCertificateFormConfig>,
    required: true,
    validator: (config: BaseFormConfig): boolean => {
      if (!config.cancelRoute) return false
      return true
    },
  },
  userId: {
    type: String,
    required: false,
    default: '',
  },
  username: {
    type: String,
    required: false,
    default: null,
  },
})

const router = useRouter()
const { t } = useI18n()
const { getMessageFromError } = useErrors()

const formType = computed((): EntityBaseFormType => props.userId ? EntityBaseFormType.Edit : EntityBaseFormType.Create)

const form = reactive<UserAdminFormState>({
  fields: {
    username: props.username || '',
    password: '',
    newPassword: '',
    repassword: '',
  },
  isReadonly: false,
  errorMessage: '',
})

const formFieldsOriginal = reactive<UserAdminFormFields>({
  username: '',
  password: '',
  repassword: '',
  newPassword: '',
})

const canSubmit = computed((): boolean => (formType.value === EntityBaseFormType.Create || JSON.stringify(form.fields) !== JSON.stringify(formFieldsOriginal)) && !!form.fields.password && !!form.fields.repassword)

const initForm = (data: Record<string, any>): void => {
  form.fields.username = data?.username || ''
  form.fields.password = data?.password || ''
  form.fields.repassword = data?.repassword || ''

  Object.assign(formFieldsOriginal, form.fields)
}

const handleClickCancel = (): void => {
  router.push(props.config.cancelRoute)
}

const requestBody = computed((): Record<string, any> => {
  return {
    username: form.fields.username,
    password: form.fields.password,
    newPassword: form.fields.newPassword,
    repassword: form.fields.repassword,
  }
})

const saveFormData = async (): Promise<void> => {
  try {
    form.isReadonly = true

    let response: AxiosResponse | undefined

    if (formType.value === 'create') {
      response = await apiService.createRecord('admin_users', requestBody.value)
    } else if (formType.value === 'edit') {
      response = await apiService.updateRecord('admin_users/updatePass', props.userId, requestBody.value)
    }

    form.fields.password = ''
    form.fields.repassword = ''

    Object.assign(formFieldsOriginal, form.fields)

    emit('update', response?.data)
  } catch (error: any) {
    form.errorMessage = getMessageFromError(error)
    emit('error', error)
  } finally {
    form.isReadonly = false
  }
}

interface UserAdminFormFields {
  username: string,
  password: string,
  repassword: string,
  newPassword: string,
}

interface UserAdminFormState {
  fields: UserAdminFormFields;
  isReadonly: boolean;
  errorMessage: string;
}
</script>

  <style lang="scss" scoped>
  .kong-ui-entities-create-users-form {
    width: 100%;

    .certificate-form-textarea {
      width: 100%;
    }
  }
  </style>
