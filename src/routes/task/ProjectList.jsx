import React from 'react'
import { Card, Table, Button, Modal, Form, Input, InputNumber, Popconfirm, Space, TreeSelect } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import DeptTree from '../../components/DeptTree'
import useResizable from '../../common/hooks/UseResizable'
import useProjectListModel from '../../models/ProjectList'
import dayjs from 'dayjs'

const ProjectList = () => {
  const model = useProjectListModel()
  const {
    loading, deleteLoading, data, selectedDept, selectedDeptName, modalVisible, modalTitle,
    submitLoading, form, pagination, deptTreeData,
    handleQuery, handleDeptSelect, handleAdd, handleEdit, handleDelete,
    handleSubmit, handlePageChange
  } = model

  const [leftWidth, onResizeStart] = useResizable(240)

  const columns = [
    { title: '项目名称', dataIndex: 'projectName', key: 'projectName', width: 200 },
    { title: '项目描述', dataIndex: 'projectDesc', key: 'projectDesc', ellipsis: true },
    { title: '完成度', dataIndex: 'completionRate', key: 'completionRate', width: 100, render: v => `${v || 0}%` },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 180, render: v => v ? dayjs(v).format('YYYY-MM-DD HH:mm:ss') : '-' },
    {
      title: '操作', key: 'action', width: 150,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Popconfirm title="确认删除?" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />} loading={deleteLoading === record.id}>删除</Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

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
            <Form.Item name="projectName" label="项目名称"><Input placeholder="请输入" /></Form.Item>
            <Form.Item><Button type="primary" htmlType="submit">查询</Button></Form.Item>
          </Form>
          <div style={{ marginBottom: 16 }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增项目</Button>
            {selectedDept && <span style={{ marginLeft: 16, color: '#666' }}>当前选择部门：{selectedDeptName}</span>}
          </div>
          <Table
            columns={columns}
            dataSource={data}
            rowKey="id"
            loading={loading}
            pagination={{ current: pagination.current, pageSize: pagination.pageSize, total: pagination.total, onChange: handlePageChange }}
          />
        </Card>
      </div>
      <Modal title={modalTitle} open={modalVisible} onOk={handleSubmit} onCancel={() => model.setModalVisible(false)} confirmLoading={submitLoading} width={600}>
        <Form form={form} layout="vertical">
          <Form.Item name="projectId" hidden><Input /></Form.Item>
          <Form.Item name="status" hidden><Input /></Form.Item>
          <Form.Item name="projectName" label="项目名称" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="projectDesc" label="项目描述"><Input.TextArea rows={3} /></Form.Item>
          <Form.Item name="deptId" label="所属部门">
            <TreeSelect treeData={deptTreeData} placeholder="请选择部门" allowClear treeDefaultExpandAll style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="completionRate" label="完成度(%)"><InputNumber min={0} max={100} style={{ width: '100%' }} /></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ProjectList
