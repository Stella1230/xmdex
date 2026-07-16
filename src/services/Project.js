import { service, MOCK_MODE, mockRequest } from './index'

export const getTodoProjectList = (data) => MOCK_MODE ? mockRequest('/todo/project/list.do', { method: 'POST', data }) : service.post('/queryProjectList.do', data)

export const getTodoProject = (data) => MOCK_MODE ? mockRequest('/todo/project/getProject.do', { method: 'POST', data: { id: data.id } }) : service.post('/getProjectDetail.do', { id: data.id })

export const addTodoProject = (data) => MOCK_MODE ? mockRequest('/todo/project/add.do', { method: 'POST', data }) : service.post('/createProject.do', data)

export const updateTodoProject = (data) => MOCK_MODE ? mockRequest('/todo/project/update.do', { method: 'POST', data }) : service.post('/modifyProject.do', {...data, id:data.projectId})

export const deleteTodoProject = (data) => MOCK_MODE ? mockRequest('/todo/project/delete.do', { method: 'POST', data: { id: data.id } }) : service.post('/removeProject.do', { id: data.id })
