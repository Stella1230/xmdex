import { service, MOCK_MODE, mockRequest } from './index'

export const getDeptTree = (data) => MOCK_MODE? mockRequest('/system/dept/treeselect.do', { method: 'POST', data }): service.post('/queryDeptTree.do', data)
export const getDeptList = (data) => MOCK_MODE ? mockRequest('/system/dept/list.do', { method: 'POST', data }) : service.post('/queryDeptList.do', data || {})

export const getDeptDetail = (data) => MOCK_MODE ? mockRequest('/system/dept/get.do', { method: 'POST', data }) : service.post('/queryDeptDetail.do', { id: data.id })

export const addDept = (data) => MOCK_MODE ? mockRequest('/system/dept/add.do', { method: 'POST', data }) : service.post('/createDept.do', data)

export const updateDept = (data) => MOCK_MODE ? mockRequest('/system/dept/update.do', { method: 'POST', data }) : service.post('/modifyDept.do', data)

export const deleteDept = (data) => MOCK_MODE ? mockRequest('/system/dept/delete.do', { method: 'POST', data: { id: data.id } }) : service.post('/removeDept.do', { id: data.id })
