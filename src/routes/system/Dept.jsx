import React from 'react'
import { Card, Table, Button, Modal, Form, Input, Space, Popconfirm } from 'antd'
import { EditOutlined, DeleteOutlined, SyncOutlined } from '@ant-design/icons'
import { parseTime } from '../../utils/Date'
import DeptTree from '../../components/DeptTree'
import useResizable from '../../common/hooks/UseResizable'
import useDeptModel from '../../models/Dept'

const Dept = () => {
  const model = useDeptModel()
  const {
    loading, flatData, deptTree, selectedDept, selectedDeptName,
    modalVisible, modalTitle, submitLoading, form, pagination,
    handleDeptSelect, handleQuery, handleReset, handleAddTop, handleAddChild,
    handleEdit, handleDelete, handleSubmit, handlePageChange
  } = model

  const [leftWidth, onResizeStart] = useResizable(240)

  const columns = [
    { title: '部门名称', dataIndex: 'deptName', key: 'deptName', width: 200 },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 160, render: v => parseTime(v) },
    {
      title: '操作', key: 'action', width: 150,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Popconfirm title="确认删除?" onConfirm={() => handleDelete(record)}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <div className="resize-layout">
      <div className="resize-left" style={{ width: leftWidth }}>
        <Card
          title="部门筛选"
          size="small"
          extra={
            <Space>
              <Button type="link" size="small" onClick={handleAddTop}>新增顶级部门</Button>
              <Button type="link" size="small" onClick={() => { model.setSelectedDept(null); model.setSelectedDeptName(''); }}>重置</Button>
            </Space>
          }
        >
          <DeptTree
            data={deptTree}
            onSelect={handleDeptSelect}
            onAddChild={(node) => handleAddChild({ id: node.key, deptName: node.title })}
            selectedKeys={selectedDept ? [selectedDept] : []}
            height={450}
          />
        </Card>
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
            <Form.Item name="deptName" label="部门名称"><Input placeholder="请输入" /></Form.Item>
            <Form.Item><Button type="primary" htmlType="submit">查询</Button></Form.Item>
            <Form.Item><Button icon={<SyncOutlined />} onClick={handleReset}>重置</Button></Form.Item>
          </Form>
          {selectedDeptName && (
            <div style={{ marginBottom: 16, color: '#666' }}>
              当前选择部门： {selectedDeptName}
            </div>
          )}
          <Table
            columns={columns}
            dataSource={flatData}
            rowKey="id"
            loading={loading}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              onChange: handlePageChange
            }}
          />
        </Card>
      </div>
      <Modal title={modalTitle} open={modalVisible} onOk={handleSubmit} onCancel={() => model.setModalVisible(false)} confirmLoading={submitLoading} width={500}>
        <Form form={form} layout="vertical">
          <Form.Item name="id" hidden><Input /></Form.Item>
          <Form.Item name="parentId" hidden><Input /></Form.Item>
          <Form.Item name="parentName" label="上级部门">
            <Input disabled />
          </Form.Item>
          <Form.Item name="deptName" label="部门名称" rules={[{ required: true, message: '请输入部门名称' }, { max: 100, message: '部门名称不能超过100个字符' }]}>
            <Input placeholder="请输入部门名称" />
          </Form.Item>
          <Form.Item name="remark" label="备注" rules={[{ max: 500, message: '备注不能超过500个字符' }]}>
            <Input.TextArea rows={3} placeholder="请输入备注" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Dept
