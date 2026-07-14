import React, { useState, useEffect } from 'react'
import { Card, Table, Button, Modal, Form, Input, Select, Space, Popconfirm, message, Tag } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import { getNoticeList } from '../../services'

const { Option } = Select

const Notice = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [modalTitle, setModalTitle] = useState('新增通知')
  const [form] = Form.useForm()
  const [viewVisible, setViewVisible] = useState(false)
  const [viewData, setViewData] = useState({})
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async (params = {}) => {
    setLoading(true)
    try {
      const res = await getNoticeList({ ...pagination, ...params })
      setData(res.rows || [])
      setPagination({ ...pagination, total: res.total })
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setModalTitle('新增通知')
    form.resetFields()
    setModalVisible(true)
  }

  const handleEdit = (record) => {
    setModalTitle('编辑通知')
    form.setFieldsValue(record)
    setModalVisible(true)
  }

  const handleView = (record) => {
    setViewData(record)
    setViewVisible(true)
  }

  const handleSubmit = async () => {
    const values = await form.validateFields()
    try {
      message.success(modalTitle + '成功')
      setModalVisible(false)
      fetchData()
    } catch (e) {
      console.error(e)
    }
  }

  const columns = [
    { title: '通知ID', dataIndex: 'noticeId', key: 'noticeId', width: 80 },
    { title: '通知标题', dataIndex: 'noticeTitle', key: 'noticeTitle', ellipsis: true },
    { title: '通知类型', dataIndex: 'noticeType', key: 'noticeType', width: 100, render: v => <Tag color={v === '1' ? 'red' : 'blue'}>{v === '1' ? '公告' : '通知'}</Tag> },
    { title: '状态', dataIndex: 'status', key: 'status', width: 80, render: v => <Tag color={v === '0' ? 'green' : 'red'}>{v === '0' ? '正常' : '停用'}</Tag> },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 160 },
    {
      title: '操作', key: 'action', width: 180,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleView(record)}>查看</Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Popconfirm title="确认删除?">
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <Card>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增通知</Button>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="noticeId"
        loading={loading}
        pagination={{ current: pagination.current, pageSize: pagination.pageSize, total: pagination.total }}
      />
      <Modal title={modalTitle} open={modalVisible} onOk={handleSubmit} onCancel={() => setModalVisible(false)} width={600}>
        <Form form={form} layout="vertical">
          <Form.Item name="noticeId" hidden><Input /></Form.Item>
          <Form.Item name="noticeTitle" label="通知标题" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="noticeType" label="通知类型" initialValue="1">
            <Select><Option value="1">公告</Option><Option value="2">通知</Option></Select>
          </Form.Item>
          <Form.Item name="noticeContent" label="通知内容">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item name="status" label="状态" initialValue="0">
            <Select><Option value="0">正常</Option><Option value="1">停用</Option></Select>
          </Form.Item>
        </Form>
      </Modal>
      <Modal title="查看通知" open={viewVisible} onOk={() => setViewVisible(false)} onCancel={() => setViewVisible(false)} footer={null} width={600}>
        <h2>{viewData.noticeTitle}</h2>
        <p style={{ color: '#999', marginBottom: 16 }}>发布时间: {viewData.createTime}</p>
        <div>{viewData.noticeContent || '暂无内容'}</div>
      </Modal>
    </Card>
  )
}

export default Notice