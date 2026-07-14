import React, { useState, useEffect } from 'react'
import { Input, Tree, Dropdown, Spin } from 'antd'
import { SearchOutlined, UserOutlined, MoreOutlined } from '@ant-design/icons'
import { getDeptTree } from '../services'

const DeptTree = ({
  data,
  onSelect,
  onAddChild,
  selectedKeys = [],
  showSearch = true,
  defaultExpandAll = true,
  height = 400
}) => {
  const [treeData, setTreeData] = useState([])
  const [expandedKeys, setExpandedKeys] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [autoExpandParent, setAutoExpandParent] = useState(true)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (data && data.length > 0) {
      const transformed = transformTreeData(data)
      setTreeData(transformed)
      if (defaultExpandAll) {
        setExpandedKeys(getAllKeys(transformed))
      }
    } else if (!data) {
      fetchTree()
    }
  }, [data])

  const fetchTree = async () => {
    setLoading(true)
    try {
      const res = await getDeptTree({})
      let raw = []
      if (Array.isArray(res)) {
        raw = res
      } else if (res && typeof res === 'object') {
        raw = Object.values(res).filter(Boolean)
      }
      const transformed = transformTreeData(raw)
      setTreeData(transformed)
      if (defaultExpandAll) {
        setExpandedKeys(getAllKeys(transformed))
      }
    } catch (e) {
      console.error('DeptTree fetch error:', e)
    } finally {
      setLoading(false)
    }
  }

  const transformTreeData = (nodes) => {
    if (!nodes || !Array.isArray(nodes)) return []
    return nodes.map(node => ({
      key: node.id || node.key,
      title: node.deptName || node.title,
      children: node.children ? transformTreeData(node.children) : []
    }))
  }

  const getAllKeys = (nodes) => {
    const keys = []
    const walk = (list) => {
      list.forEach(node => {
        keys.push(node.key)
        if (node.children && node.children.length > 0) {
          walk(node.children)
        }
      })
    }
    walk(nodes)
    return keys
  }

  const getMatchedKeys = (nodes, value) => {
    const keys = []
    const walk = (list) => {
      list.forEach(node => {
        if (node.title && node.title.toLowerCase().includes(value)) {
          keys.push(node.key)
        }
        if (node.children && node.children.length > 0) {
          walk(node.children)
        }
      })
    }
    walk(nodes)
    return keys
  }

  const getParentKeys = (nodes, targetKey, path = []) => {
    for (const node of nodes) {
      if (node.key === targetKey) return path
      if (node.children && node.children.length > 0) {
        const result = getParentKeys(node.children, targetKey, [...path, node.key])
        if (result) return result
      }
    }
    return null
  }

  const expandMatchedKeys = (value) => {
    if (!value) {
      setExpandedKeys(defaultExpandAll ? getAllKeys(treeData) : [])
      setAutoExpandParent(true)
      return
    }
    const matchedKeys = getMatchedKeys(treeData, value.toLowerCase())
    const parentKeys = []
    matchedKeys.forEach(key => {
      const parents = getParentKeys(treeData, key)
      if (parents) parentKeys.push(...parents)
    })
    setExpandedKeys([...new Set([...matchedKeys, ...parentKeys])])
    setAutoExpandParent(true)
  }

  const handleSearch = (e) => {
    const value = e.target.value
    setSearchValue(value)
    expandMatchedKeys(value)
  }

  const handleSelect = (keys, { node }) => {
    if (onSelect) {
      onSelect(keys[0] || null, node)
    }
  }

  const handleExpand = (keys) => {
    setExpandedKeys(keys)
    setAutoExpandParent(false)
  }

  const TreeNode = ({ node }) => {
    const [hovered, setHovered] = useState(false)
    const menuItems = onAddChild ? [{
      key: 'addChild',
      label: '添加子组织',
      onClick: (e) => { e.domEvent.stopPropagation(); onAddChild(node) }
    }] : []
    return (
      <span
        className="dept-tree-node"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          padding: '2px 4px',
          borderRadius: 4,
          backgroundColor: hovered ? '#f0f5ff' : 'transparent',
          transition: 'background-color 0.2s'
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, minWidth: 0 }}>
          <UserOutlined style={{ marginRight: 6, color: '#1890ff' }} />
          {node.title}
        </span>
        {onAddChild && hovered && (
          <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
            <MoreOutlined
              style={{ flexShrink: 0, marginLeft: 4, fontSize: 16, color: '#666', cursor: 'pointer', padding: '2px 4px' }}
              onClick={(e) => e.stopPropagation()}
            />
          </Dropdown>
        )}
      </span>
    )
  }

  return (
    <div>
      {showSearch && (
        <div style={{ marginBottom: 8 }}>
          <Input
            placeholder="部门名称搜索"
            prefix={<SearchOutlined />}
            value={searchValue}
            onChange={handleSearch}
            allowClear
          />
        </div>
      )}
      <Spin spinning={loading}>
        <div style={{ minHeight: height, overflow: 'auto' }}>
          {treeData.length > 0 ? (
            <Tree
              treeData={treeData}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              selectedKeys={selectedKeys}
              onSelect={handleSelect}
              onExpand={handleExpand}
              titleRender={(node) => <TreeNode node={node} />}
            />
          ) : (
            !loading && <div style={{ color: '#999', textAlign: 'center', padding: 20 }}>暂无部门数据</div>
          )}
        </div>
      </Spin>
    </div>
  )
}

export default DeptTree
