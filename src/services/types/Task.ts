import { PaginationParams, PaginatedRowsResponse, EmptyResponse, IdParam } from './Common'

// ========== 请求参数 ==========

export interface TaskListParams extends PaginationParams {
  taskContent?: string
  projectId?: string
  status?: string
  deptId?: string | null
  dateRange?: [string, string]
}

export interface AddTaskRequest {
  taskContent: string
  projectId: string
  userId?: string
  planFinishTime?: string
  status: string
}

export interface UpdateTaskRequest {
  taskId: string
  taskContent?: string
  projectId?: string
  userId?: string
  planFinishTime?: string
  status?: string
}

export type DeleteTaskRequest = IdParam
export type CompleteTaskRequest = IdParam
export type ReopenTaskRequest = IdParam

// ========== 响应数据 ==========

export interface TaskListItem {
  id: string
  taskId: string
  taskTitle: string
  taskContent: string
  taskType: string
  priority: number
  status: string
  creatorId: string
  ownerId: string
  deptId: string
  projectId: string
  revokeStatus: string
  creatorName: string
  ownerName: string
  createTime: string
  updateTime: string
  completeTime: string | null
  startDate: string | null
  deadline: string | null
  projectName: string | null
  deptName: string | null
}

export type TaskListResponse = PaginatedRowsResponse<TaskListItem>
export type TaskDetailResponse = TaskListItem

// ========== 接口函数签名 ==========

export type GetTodoTaskListFn = (data: TaskListParams) => Promise<TaskListResponse>
export type GetTodoTaskFn = (data: IdParam) => Promise<TaskDetailResponse>
export type AddTodoTaskFn = (data: AddTaskRequest) => Promise<EmptyResponse>
export type UpdateTodoTaskFn = (data: UpdateTaskRequest) => Promise<EmptyResponse>
export type DeleteTodoTaskFn = (data: DeleteTaskRequest) => Promise<EmptyResponse>
export type CompleteTodoTaskFn = (data: CompleteTaskRequest) => Promise<EmptyResponse>
export type ReopenTodoTaskFn = (data: ReopenTaskRequest) => Promise<EmptyResponse>
