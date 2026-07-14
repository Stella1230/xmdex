import { service, MOCK_MODE } from './index'
import { mockApi } from './Mock'

const mockRequest = (url, options) => mockApi(url, options)

export const getUserList = (data) => MOCK_MODE ? mockRequest('/system/user/list.do', { method: 'POST', data }) : service.post('/queryUserList.do', data)

export const addUser = (data) => MOCK_MODE ? mockRequest('/system/user/add.do', { method: 'POST', data }) : service.post('/createUser.do', data)

export const updateUser = (data) => MOCK_MODE ? mockRequest('/system/user/update.do', { method: 'POST', data }) : service.post('/modifyUser.do', data)

export const deleteUser = (data) => MOCK_MODE ? mockRequest('/system/user/delete.do', { method: 'POST', data: { id: data.id } }) : service.post('/removeUser.do', { id: data.id })

export const resetPwd = (data) => MOCK_MODE ? mockRequest('/system/user/resetPwd.do', { method: 'POST', data }) : service.post('/resetPwd.do', data)
