import { reactive, toRefs } from 'vue'
import type { KongManagerBaseFormConfig } from '@kong-ui-public/entities-shared'
import { useBaseGeneralConfig } from './useBaseGeneralConfig'

export const useFormGeneralConfig = () => {
  return reactive({
    ...toRefs(useBaseGeneralConfig()),
    jsonYamlFormsEnabled: true,
  }) as Pick<KongManagerBaseFormConfig, 'app' | 'workspace' | 'gatewayInfo' | 'apiBaseUrl' | 'jsonYamlFormsEnabled'>
}
