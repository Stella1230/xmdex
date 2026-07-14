import { useState, useEffect, useRef } from 'react'
import { Form, message } from 'antd'
import { getRoleList, addRole, updateRole, deleteRole, getMenuTree, authRoleMenu } from '../services'
import { getPageCache, setPageCache } from '../common/PageCache'

const CACHE_KEY = 'role'

const transformMenuTree = (nodes) => {
  if (!nodes || !Array.isArray(nodes)) return []
  return nodes.map(node => ({
    key: node.id,
    title: node.menuName,
    children: node.children ? transformMenuTree(node.children) : []
  }))
}

const useRoleModel = () => {
  const cached = getPageCache(CACHE_KEY)

  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [menuTree, setMenuTree] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [authModalVisible, setAuthModalVisible] = useState(false)
  const [modalTitle, setModalTitle] = useState('新增角色')
  const [submitLoading, setSubmitLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form] = Form.useForm()
  const [currentRole, setCurrentRole] = useState(null)
  const [checkedMenuKeys, setCheckedMenuKeys] = useState([])
  const [expandedMenuKeys, setExpandedMenuKeys] = useState([])
  const [menuLoading, setMenuLoading] = useState(false)
  const [pagination, setPagination] = useState(cached?.pagination ?? { current: 1, pageSize: 10, total: 0 })
  const paginationRef = useRef(pagination)
  paginationRef.current = pagination

  useEffect(() => {
    if (cached) {
      fetchData({ pageNum: cached.pagination.current, pageSize: cached.pagination.pageSize })
    } else {
      fetchData()
    }
    fetchMenuTree()
    return () => {
      setPageCache(CACHE_KEY, { pagination })
    }
  }, [])

  useEffect(() => {
    setPageCache(CACHE_KEY, { pagination })
  }, [pagination])

  const fetchData = async (params = {}) => {
    setLoading(true)
    try {
      const { current, pageSize } = paginationRef.current
      const res = await getRoleList({ pageNum: params.pageNum || current, pageSize: params.pageSize || pageSize, ...params })
      setData(res.resultData?.rows || res.rows || [])
      setPagination(prev => ({ ...prev, total: res.resultData?.total || res.total || 0, ...params }))
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const fetchMenuTree = async () => {
    setMenuLoading(true)
    try {
      const res = await getMenuTree()
      const tree = Array.isArray(res) ? res : (res.data || [])
      setMenuTree(transformMenuTree(tree))
    } catch (e) {
      console.error(e)
    } finally {
      setMenuLoading(false)
    }
  }

  const getAllLeafKeys = (nodes) => {
    const keys = []
    const walk = (list) => {
      list.forEach(node => {
        if (!node.children || node.children.length === 0) {
          keys.push(node.key)
        } else {
          walk(node.children)
        }
      })
    }
    walk(nodes)
    return keys
  }

  const handleAdd = () => {
    setModalTitle('新增角色')
    setEditingId(null)
    form.resetFields()
    setModalVisible(true)
  }

  const handleEdit = (record) => {
    setModalTitle('编辑角色')
    setEditingId(record.id)
    form.setFieldsValue(record)
    setModalVisible(true)
  }

  const handleDelete = async (record) => {
    if (loading) return
    try {
      await deleteRole({ id: record.id })
      message.success('删除成功')
      fetchData()
    } catch (e) {
      console.error(e)
      message.error(e.message || '删除失败')
    }
  }

  const handleAuth = async (record) => {
    setCurrentRole(record)
    setAuthModalVisible(true)
    try {
      const res = await authRoleMenu({ roleId: record.id, action: 'get' })
      const assignedIds = res.data || res.menuIds || res || []
      const leafKeys = getAllLeafKeys(menuTree)
      const checked = Array.isArray(assignedIds) ? assignedIds.filter(k => leafKeys.includes(k)) : []
      setCheckedMenuKeys(checked)
      setExpandedMenuKeys(menuTree.map(n => n.key))
    } catch (e) {
      setCheckedMenuKeys([])
      setExpandedMenuKeys(menuTree.map(n => n.key))
    }
  }

  const handleAuthSubmit = async () => {
    if (!currentRole) return
    setSubmitLoading(true)
    try {
      await authRoleMenu({ roleId: currentRole.id, menuIds: checkedMenuKeys })
      message.success('授权成功')
      setAuthModalVisible(false)
    } catch (e) {
      console.error(e)
      message.error(e.message || '授权失败')
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setSubmitLoading(true)
      try {
        if (editingId) {
          await updateRole(values)
          message.success('更新成功')
        } else {
          await addRole(values)
          message.success('创建成功')
        }
        setModalVisible(false)
        fetchData()
      } catch (e) {
        console.error(e)
        message.error(e.message || '操作失败')
      } finally {
        setSubmitLoading(false)
      }
    } catch (e) {
      // form.validateFields 校验失败
    }
  }

  const handlePageChange = (page, size) => {
    fetchData({ pageNum: page, pageSize: size })
  }

  return {
    loading, data, menuTree, modalVisible, authModalVisible, modalTitle,
    submitLoading, editingId, form, currentRole, checkedMenuKeys,
    expandedMenuKeys, menuLoading, pagination,
    handleAdd, handleEdit, handleDelete, handleAuth, handleAuthSubmit,
    handleSubmit, handlePageChange,
    setCheckedMenuKeys, setExpandedMenuKeys, setAuthModalVisible, setCurrentRole
  }
}

export default useRoleModel
