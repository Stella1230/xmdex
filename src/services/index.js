import axios from 'axios'
import { message } from 'antd'
import { mockApi } from './Mock'

const MOCK_MODE = process.env.REACT_APP_MOCK === 'true'

function generateTraceNo() {
  return `HW-INT-90216-${Date.now()}${Math.floor(Math.random() * 100000)}`
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return dateStr
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  } catch (e) {
    return dateStr
  }
}

function formatDateFields(obj) {
  if (!obj || typeof obj !== 'object') return obj
  if (Array.isArray(obj)) return obj.map(item => formatDateFields(item))
  const newObj = {}
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key]
      if (typeof value === 'string' && (key === 'createTime' || key === 'updateTime' || key === 'loginDate' || key === 'completeTime' || key === 'submitTime' || key === 'operTime' || key === 'loginTime')) {
        newObj[key] = formatDate(value)
      } else if (Array.isArray(value)) {
        newObj[key] = value.map(item => formatDateFields(item))
      } else if (value && typeof value === 'object' && !(value instanceof Date)) {
        newObj[key] = formatDateFields(value)
      } else {
        newObj[key] = value
      }
    }
  }
  return newObj
}

let isRedirecting = false
const redirectToLogin = () => {
  if (isRedirecting) return
  isRedirecting = true
  message.error('登录已过期，请重新登录')
  localStorage.removeItem('token')
  localStorage.removeItem('userId')
  localStorage.removeItem('deptId')
  localStorage.removeItem('roleId')
  localStorage.removeItem('menus')
  window.location.hash = '#/login'
  setTimeout(() => { isRedirecting = false }, 2000)
}

const service = axios.create({
  baseURL: '/api',
  timeout: 10000
})

service.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (config.data && !(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
      const urlPath = config.url.replace('.do', '').replace('/', '')

      // 非登录接口，将 token 注入 REQ_BODY
      let reqBody = config.data
      if (token && !config.url.includes('handleLogin')) {
        reqBody = { ...config.data, token }
      }

      const requestBody = {
        REQ_HEAD: {
          TRANS_PROCESS: urlPath,
          TRAN_ID: generateTraceNo()
        },
        REQ_BODY: reqBody
      }
      config.data = `REQ_MESSAGE=${encodeURIComponent(JSON.stringify(requestBody))}`
    }
    return config
  },
  error => Promise.reject(error)
)

service.interceptors.response.use(
  response => {
    const data = response.data
    if (data.RSP_HEAD && data.RSP_HEAD.TRAN_SUCCESS === '0') {
      if (data.RSP_HEAD?.ERROR_MESSAGE?.includes('TOKEN') || data.RSP_HEAD?.ERROR_MESSAGE?.includes('登录')) {
        redirectToLogin()
        return Promise.reject(new Error('登录已过期'))
      }
      message.error(data.RSP_HEAD?.ERROR_MESSAGE || '操作失败')
      return Promise.reject(new Error(data.RSP_HEAD?.ERROR_MESSAGE || '操作失败'))
    }
    const result = data.RSP_BODY?.resultData || data.RSP_BODY || data
    return formatDateFields(result)
  },
  error => {
    if (error.response?.status === 401) {
      redirectToLogin()
    } else if (error.response?.status === 500) {
      message.error('服务器错误，请稍后重试')
    } else {
      message.error(error.message || '网络错误')
    }
    return Promise.reject(error)
  }
)

const mockRequest = async (url, options = {}) => {
  const res = await mockApi(url, options)
  return res.RSP_BODY?.resultData ?? res
}

export { service, MOCK_MODE, mockRequest }

export * from './Auth'
export * from './Dept'
export * from './Role'
export * from './User'
export * from './Project'
export * from './Task'

export const getMenuList = (data) => MOCK_MODE ? mockRequest('/system/menu/list.do', { method: 'POST', data }) : service.post('/queryMenuList.do', data || {})

export const getConfigList = (data) => MOCK_MODE ? mockRequest('/system/config/list.do', { method: 'POST', data }) : service.post('/system/config/list.do', data || {})
export const addConfig = (data) => MOCK_MODE ? mockRequest('/system/config/add.do', { method: 'POST', data }) : service.post('/system/config/add.do', data)
export const updateConfig = (data) => MOCK_MODE ? mockRequest('/system/config/update.do', { method: 'POST', data }) : service.post('/system/config/update.do', data)
export const deleteConfig = (data) => MOCK_MODE ? mockRequest('/system/config/delete.do', { method: 'POST', data: { id: data.id } }) : service.post('/system/config/delete.do', { id: data.id })

export const getDictTypeList = (data) => MOCK_MODE ? mockRequest('/system/dict/type/list.do', { method: 'POST', data }) : service.post('/system/dict/type/list.do', data || {})
export const addDictType = (data) => MOCK_MODE ? mockRequest('/system/dict/type/add.do', { method: 'POST', data }) : service.post('/system/dict/type/add.do', data)
export const updateDictType = (data) => MOCK_MODE ? mockRequest('/system/dict/type/update.do', { method: 'POST', data }) : service.post('/system/dict/type/update.do', data)
export const deleteDictType = (data) => MOCK_MODE ? mockRequest('/system/dict/type/delete.do', { method: 'POST', data: { id: data.id } }) : service.post('/system/dict/type/delete.do', { id: data.id })

export const getNoticeList = (data) => MOCK_MODE ? mockRequest('/system/notice/list.do', { method: 'POST', data }) : service.post('/system/notice/list.do', data || {})
export const addNotice = (data) => MOCK_MODE ? mockRequest('/system/notice/add.do', { method: 'POST', data }) : service.post('/system/notice/add.do', data)
export const updateNotice = (data) => MOCK_MODE ? mockRequest('/system/notice/update.do', { method: 'POST', data }) : service.post('/system/notice/update.do', data)
export const deleteNotice = (data) => MOCK_MODE ? mockRequest('/system/notice/delete.do', { method: 'POST', data: { id: data.id } }) : service.post('/system/notice/delete.do', { id: data.id })

export const getPostList = (data) => MOCK_MODE ? mockRequest('/system/post/list.do', { method: 'POST', data }) : service.post('/system/post/list.do', data || {})
export const addPost = (data) => MOCK_MODE ? mockRequest('/system/post/add.do', { method: 'POST', data }) : service.post('/system/post/add.do', data)
export const updatePost = (data) => MOCK_MODE ? mockRequest('/system/post/update.do', { method: 'POST', data }) : service.post('/system/post/update.do', data)
export const deletePost = (data) => MOCK_MODE ? mockRequest('/system/post/delete.do', { method: 'POST', data: { id: data.id } }) : service.post('/system/post/delete.do', { id: data.id })

export default service
