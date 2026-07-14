import { service, MOCK_MODE } from './index'
import { mockApi } from './Mock'

const mockRequest = (url, options) => mockApi(url, options)

export const getRoleList = (data) => MOCK_MODE ? mockRequest('/system/role/list.do', { method: 'POST', data }) : service.post('/queryRoleList.do', data)

export const addRole = (data) => MOCK_MODE ? mockRequest('/system/role/add.do', { method: 'POST', data }) : service.post('/createRole.do', data)

export const updateRole = (data) => MOCK_MODE ? mockRequest('/system/role/update.do', { method: 'POST', data }) : service.post('/modifyRole.do', data)

export const deleteRole = (data) => MOCK_MODE ? mockRequest('/system/role/delete.do', { method: 'POST', data: { id: data.id } }) : service.post('/removeRole.do', { id: data.id })

export const authRoleMenu = (data) => MOCK_MODE ? mockRequest('/system/role/authMenu.do', { method: 'POST', data }) : service.post('/assignMenu.do', data)

export const getMenuTree = (data) => MOCK_MODE ? mockRequest('/system/menu/treeselect.do', { method: 'POST', data }) : service.post('/queryMenuTree.do', data || {})

export const getMenuListAll = (data) => MOCK_MODE ? mockRequest('/system/menu/list.do', { method: 'POST', data }) : service.post('/queryMenuList.do', data || {})

export const addMenu = (data) => MOCK_MODE ? mockRequest('/system/menu/add.do', { method: 'POST', data }) : service.post('/createMenu.do', data)

export const updateMenu = (data) => MOCK_MODE ? mockRequest('/system/menu/update.do', { method: 'POST', data }) : service.post('/modifyMenu.do', data)

export const deleteMenu = (data) => MOCK_MODE ? mockRequest('/system/menu/delete.do', { method: 'POST', data: { id: data.id } }) : service.post('/removeMenu.do', { id: data.id })
