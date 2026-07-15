import React from 'react'
import { Card, Table, Button, Modal, Form, Input, Select, DatePicker, Space, Popconfirm } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { getStatusTag } from '../../utils/Status'
import DeptTree from '../../components/DeptTree'
import useResizable from '../../common/hooks/UseResizable'
import useTaskTodoModel from '../../models/TaskTodo'
import dayjs from 'dayjs'

const { RangePicker } = DatePicker
const { Option } = Select
const { TextArea } = Input

const TaskTodo = () => {
  const model = useTaskTodoModel()
  const {
    loading, data, projects, selectedDept, selectedDeptName, modalVisible, modalTitle,
    submitLoading, editingRecord, form, pagination, deptTreeData,
    canAdd, canEdit, canDelete, canUpdateStatusOnly, filteredUsers,
    handleDeptSelect, handleQuery, handleAdd, handleEdit, handleStatusUpdate,
    handleDelete, handleSubmit, handlePageChange
  } = model

  const [leftWidth, onResizeStart] = useResizable(240)

  const columns = [
    { title: '任务内容', dataIndex: 'taskContent', key: 'taskContent', ellipsis: true, width: 250 },
    { title: '项目', dataIndex: 'projectName', key: 'projectName', width: 150 },
    { title: '负责人', dataIndex: 'realName', key: 'realName', width: 100 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 80, render: v => getStatusTag(v) },
    { title: '计划完成时间', dataIndex: 'planFinishTime', key: 'planFinishTime', width: 120, render: v => v ? dayjs(v).format('MM-DD') : '-' },
    { title: '实际完成时间', dataIndex: 'finishTime', key: 'finishTime', width: 120, render: v => v ? dayjs(v).format('MM-DD HH:mm') : '-' },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 150, render: v => v ? dayjs(v).format('YYYY-MM-DD HH:mm') : '-' },
    {
      title: '操作', key: 'action', width: 200,
      render: (_, record) => (
        <Space>
          {canEdit && <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>}
          {canUpdateStatusOnly && record.status !== '2' && record.status !== '3' && (
            <Button type="link" size="small" onClick={() => handleStatusUpdate(record)}>更新状态</Button>
          )}
          {canDelete && (
            <Popconfirm title="确认删除?" onConfirm={() => handleDelete(record.taskId)}>
              <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
            </Popconfirm>
          )}
        </Space>
      )
    }
  ]

  const renderFormFields = () => {
    if (canUpdateStatusOnly && editingRecord) {
      return (
        <>
          <Form.Item name="taskId" hidden><Input /></Form.Item>
          <Form.Item name="status" label="状态" rules={[{ required: true, message: '请选择状态' }]}>
            <Select>
              <Option value="0">待开始</Option>
              <Option value="1">进行中</Option>
              <Option value="2">已完成</Option>
            </Select>
          </Form.Item>
        </>
      )
    }

    return (
      <>
        <Form.Item name="taskId" hidden><Input /></Form.Item>
        <Form.Item name="taskContent" label="任务内容" rules={[{ required: true }]}><TextArea rows={3} /></Form.Item>
        <Form.Item name="projectId" label="所属项目" rules={[{ required: true }]}>
          <Select placeholder="请选择项目">{projects.map(p => <Option key={p.projectId} value={p.projectId}>{p.projectName}</Option>)}</Select>
        </Form.Item>
        <Form.Item name="userId" label="负责人">
          <Select placeholder="请选择负责人">
            {filteredUsers.map(u => (
              <Option key={u.userId || u.id} value={u.userId || u.id}>{u.nickName || u.name}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="planFinishTime" label="计划完成时间"><DatePicker style={{ width: '100%' }} /></Form.Item>
        <Form.Item name="status" label="状态" initialValue="0">
          <Select>
            <Option value="0">待开始</Option>
            <Option value="1">进行中</Option>
            <Option value="2">已完成</Option>
            <Option value="3">已取消</Option>
          </Select>
        </Form.Item>
      </>
    )
  }

  return (
    <div className="resize-layout">
      <div className="resize-left" style={{ width: leftWidth }}>
        <DeptTree
          data={deptTreeData}
          onSelect={handleDeptSelect}
          selectedKeys={selectedDept ? [selectedDept] : []}
        />
      </div>
      <div
        className="resize-bar"
        onMouseDown={onResizeStart}
        onMouseEnter={(e) => e.currentTarget.style.background = '#1890ff'}
        onMouseLeave={(e) => e.currentTarget.style.background = '#e8e8e8'}
      />
      <div className="resize-right">
        <Card>
          <Form layout="inline" onFinish={handleQuery} style={{ marginBottom: 16 }}>
            <Form.Item name="taskContent" label="任务内容"><Input placeholder="请输入" /></Form.Item>
            <Form.Item name="projectId" label="项目">
              <Select placeholder="请选择" allowClear style={{ width: 150 }}><Option value="">全部</Option>{projects.map(p => <Option key={p.projectId} value={p.projectId}>{p.projectName}</Option>)}</Select>
            </Form.Item>
            <Form.Item name="status" label="状态">
              <Select placeholder="请选择" allowClear style={{ width: 100 }}><Option value="">全部</Option><Option value="0">待开始</Option><Option value="1">进行中</Option><Option value="2">已完成</Option></Select>
            </Form.Item>
            <Form.Item name="dateRange" label="创建时间"><RangePicker /></Form.Item>
            <Form.Item><Button type="primary" htmlType="submit">查询</Button></Form.Item>
          </Form>
          <div style={{ marginBottom: 16 }}>
            {canAdd && <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增任务</Button>}
            {selectedDept && <span style={{ marginLeft: 16, color: '#666' }}>当前选择部门：{selectedDeptName}</span>}
          </div>
          <Table columns={columns} dataSource={data} rowKey="taskId" loading={loading} pagination={{ current: pagination.current, pageSize: pagination.pageSize, total: pagination.total, onChange: handlePageChange }} />
        </Card>
      </div>
      <Modal title={modalTitle} open={modalVisible} onOk={handleSubmit} onCancel={() => model.setModalVisible(false)} confirmLoading={submitLoading} width={600}>
        <Form form={form} layout="vertical">
          {renderFormFields()}
        </Form>
      </Modal>
    </div>
  )
}

export default TaskTodo
