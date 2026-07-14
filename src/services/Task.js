import { service, MOCK_MODE } from './index'
import { mockApi } from './Mock'

const mockRequest = (url, options) => mockApi(url, options)

export const getTodoTaskList = (data) => MOCK_MODE ? mockRequest('/todo/task/list.do', { method: 'POST', data }) : service.post('/queryTaskList.do', data)

export const getTodoTask = (data) => MOCK_MODE ? mockRequest('/todo/task/getTask.do', { method: 'POST', data: { id: data.id } }) : service.post('/getTaskDetail.do', { id: data.id })

export const addTodoTask = (data) => MOCK_MODE ? mockRequest('/todo/task/add.do', { method: 'POST', data }) : service.post('/createTask.do', data)

export const updateTodoTask = (data) => MOCK_MODE ? mockRequest('/todo/task/update.do', { method: 'POST', data }) : service.post('/modifyTask.do', data)

export const deleteTodoTask = (data) => MOCK_MODE ? mockRequest('/todo/task/delete.do', { method: 'POST', data: { id: data.id } }) : service.post('/removeTask.do', { id: data.id })

export const completeTodoTask = (data) => MOCK_MODE ? mockRequest('/todo/task/complete.do', { method: 'POST', data: { id: data.id } }) : service.post('/finishTask.do', { id: data.id })

export const reopenTodoTask = (data) => MOCK_MODE ? mockRequest('/todo/task/reopen.do', { method: 'POST', data: { id: data.id } }) : service.post('/reopenTask.do', { id: data.id })

export const getTodoBoardData = (data) => MOCK_MODE ? mockRequest('/fetchBoardData.do', { method: 'POST', data }) : service.post('/fetchBoardData.do', data || {})
