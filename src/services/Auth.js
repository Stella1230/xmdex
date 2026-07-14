import { service, MOCK_MODE } from './index'
import { mockApi } from './Mock'

const mockRequest = (url, options) => mockApi(url, options)

export const login = (data) => MOCK_MODE ? mockRequest('/login/login.do', { method: 'POST', data }) : service.post('/handleLogin.do', data)

export const logout = () => MOCK_MODE ? mockRequest('/login/logout.do', { method: 'POST', data: {} }) : service.post('/handleLogout.do', {})

export const getUserInfo = () => MOCK_MODE ? mockRequest('/login/getInfo.do', { method: 'POST', data: {} }) : service.post('/handleGetInfo.do', {})

export const changePassword = (data) => MOCK_MODE ? mockRequest('/login/changePwd.do', { method: 'POST', data }) : service.post('/handleChangePwd.do', data)
