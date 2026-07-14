import { PaginationParams, PaginatedRowsResponse, EmptyResponse, IdParam } from './Common'

// ========== 请求参数 ==========

export interface ProjectListParams extends PaginationParams {
  projectName?: string
  deptId?: string | null
}

export interface AddProjectRequest {
  projectName: string
  projectDesc?: string
  deptId: string
  completionRate?: number
}

export interface UpdateProjectRequest {
  projectId: string
  projectName: string
  projectDesc?: string
  deptId: string
  completionRate?: number
}

export type DeleteProjectRequest = IdParam

// ========== 响应数据 ==========

export interface ProjectListItem {
  id: string
  projectName: string
  projectDesc: string
  deptId: string
  completionRate: number
  projectStatus: string
  creatorId: string
  createTime: string
  updateTime: string
  startDate: string | null
  endDate: string | null
  deptName: string | null
  creatorName: string | null
}

export type ProjectListResponse = PaginatedRowsResponse<ProjectListItem>
export type ProjectDetailResponse = ProjectListItem

// ========== 接口函数签名 ==========

export type GetTodoProjectListFn = (data: ProjectListParams) => Promise<ProjectListResponse>
export type GetTodoProjectFn = (data: IdParam) => Promise<ProjectDetailResponse>
export type AddTodoProjectFn = (data: AddProjectRequest) => Promise<EmptyResponse>
export type UpdateTodoProjectFn = (data: UpdateProjectRequest) => Promise<EmptyResponse>
export type DeleteTodoProjectFn = (data: DeleteProjectRequest) => Promise<EmptyResponse>
