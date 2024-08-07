import axios, {
  type AxiosInstance,
} from 'axios'
import { config } from 'config'

const adminApiUrl = config.ADMIN_API_URL
const endpointURL = '/admin_users'

class AuthService {
  instance: AxiosInstance
  constructor() {
    this.instance = axios.create({
      baseURL: adminApiUrl,
      withCredentials: true,
      timeout: 30000,
    })
  }

  login(data: Record<string, string>) {
    return this.instance.post(`${endpointURL}/login`, data)
  }

  logout() {
    return this.instance.get(`${endpointURL}/logout`)
  }

  validateSession() {
    return this.instance.get(`${endpointURL}/validate_session`)
  }

  session_user_id() {
    //return { data: { id: 1, username: 'admin' }, status: 200 }
    return this.instance.get(`${endpointURL}/session_user_id`)
  }

}

export const authService = new AuthService()