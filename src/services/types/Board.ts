import { PaginatedRowsResponse, EmptyResponse } from './Common'

// ========== 请求参数 ==========

export interface BoardDataRequest {
  userId: string
  deptId: string
}

// ========== 响应数据 ==========

export interface StatusStat {
  completedTask: number
  inProgressTask: number
  pendingTask: number
  overdueTask: number
}

export interface ProjectStatItem {
  COMPLETEDCOUNT: number
  PROJECTID: string
  TASKCOUNT: number
  OVERDUECOUNT: number
  PROJECTNAME: string
}

export interface Recent7DaysTrend {
  dates: string[]
  newTask: number[]
  completedTask: number[]
}

export interface YesterdayTrend {
  totalTask: number
  completedTask: number
  pendingTask: number
  overdueTask: number
}

export interface BoardDataResponse {
  projectCount: number
  statusStat: StatusStat
  completionRate: number
  projectStatList: ProjectStatItem[]
  recent7DaysTrend: Recent7DaysTrend
  yesterdayTrend: YesterdayTrend
}

// ========== 接口函数签名 ==========

export type GetTodoBoardDataFn = (data: BoardDataRequest) => Promise<BoardDataResponse>
