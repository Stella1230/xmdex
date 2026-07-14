import React, { useState, useEffect } from 'react'
import { Card, Table, Button, Modal, Form, Input, Select, Space, Popconfirm, message, Tag } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { getPostList } from '../../services'

const { Option } = Select

const Post = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [modalTitle, setModalTitle] = useState('新增岗位')
  const [form] = Form.useForm()
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async (params = {}) => {
    setLoading(true)
    try {
      // getPostList 接口暂不考虑开发
      setData([])
      setPagination({ ...pagination, total: 0 })
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setModalTitle('新增岗位')
    form.resetFields()
    setModalVisible(true)
  }

  const handleEdit = (record) => {
    setModalTitle('编辑岗位')
    form.setFieldsValue(record)
    setModalVisible(true)
  }

  const handleDelete = async (id) => {
    try {
      message.success('删除成功')
      fetchData()
    } catch (e) {
      console.error(e)
    }
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
    { title: '岗位ID', dataIndex: 'postId', key: 'postId', width: 80 },
    { title: '岗位编码', dataIndex: 'postCode', key: 'postCode', width: 150 },
    { title: '岗位名称', dataIndex: 'postName', key: 'postName', width: 150 },
    { title: '显示顺序', dataIndex: 'postSort', key: 'postSort', width: 100 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 80, render: v => <Tag color={v === '0' ? 'green' : 'red'}>{v === '0' ? '正常' : '停用'}</Tag> },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 160 },
    {
      title: '操作', key: 'action', width: 150,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Popconfirm title="确认删除?" onConfirm={() => handleDelete(record.postId)}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <Card>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增岗位</Button>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="postId"
        loading={loading}
        pagination={{ current: pagination.current, pageSize: pagination.pageSize, total: pagination.total, onChange: (page, size) => fetchData({ pageNum: page, pageSize: size }) }}
      />
      <Modal title={modalTitle} open={modalVisible} onOk={handleSubmit} onCancel={() => setModalVisible(false)} width={500}>
        <Form form={form} layout="vertical">
          <Form.Item name="postId" hidden><Input /></Form.Item>
          <Form.Item name="postCode" label="岗位编码" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="postName" label="岗位名称" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="postSort" label="显示顺序" initialValue={0}><Input type="number" /></Form.Item>
          <Form.Item name="status" label="状态" initialValue="0">
            <Select><Option value="0">正常</Option><Option value="1">停用</Option></Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}

export default Post