import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Layout, Menu, Dropdown, Avatar, Badge, Modal, Tabs, Form, Input, Descriptions, message, Spin } from 'antd'
import { useHistory, withRouter } from 'react-router-dom'
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  SettingOutlined,
  LogoutOutlined,
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FileTextOutlined,
  ProjectOutlined,
  BarChartOutlined,
  CloseOutlined,
  FolderOutlined,
  UnorderedListOutlined,
  LockOutlined
} from '@ant-design/icons'
import { getUserInfo, logout as logoutApi, changePassword } from '../services'
import { useAuth } from '../common/Auth'
import './index.less'

const { Header, Sider, Content } = Layout
const { TabPane } = Tabs

const iconMap = {
  'DashboardOutlined': <DashboardOutlined />,
  'UserOutlined': <UserOutlined />,
  'TeamOutlined': <TeamOutlined />,
  'SettingOutlined': <SettingOutlined />,
  'FolderOutlined': <FolderOutlined />,
  'UnorderedListOutlined': <UnorderedListOutlined />,
  'BarChartOutlined': <BarChartOutlined />,
  'ProjectOutlined': <ProjectOutlined />,
  'FileTextOutlined': <FileTextOutlined />
}

const getIconByName = (iconName) => iconMap[iconName] || <FolderOutlined />

const transformMenu = (menuList) => {
  if (!menuList || !Array.isArray(menuList)) return []

  return menuList.map(menu => {
    const item = {
      key: menu.menuPath ? menu.menuPath.split('/').filter(Boolean).join('-') : menu.id,
      id: menu.id,
      icon: menu.menuLevel === 1 ? getIconByName('FolderOutlined') : getIconByName('UnorderedListOutlined'),
      title: menu.menuName,
      path: menu.menuPath || '',
      sortOrder: menu.sortOrder || 0
    }

    if (menu.children && menu.children.length > 0) {
      item.children = transformMenu(menu.children)
    }

    return item
  }).sort((a, b) => a.sortOrder - b.sortOrder)
}

const loadMenusFromStorage = () => {
  try {
    const menuStr = localStorage.getItem('menus')
    if (menuStr) {
      const menuIds = JSON.parse(menuStr)
      return transformMenu(menuIds)
    }
  } catch (e) {
    console.error('Failed to load menus from storage:', e)
  }
  return []
}

const defaultMenuData = [
  {
    key: 'dashboard',
    icon: <DashboardOutlined />,
    title: '首页',
    path: '/dashboard',
    sortOrder: 0
  },
  {
    key: 'task',
    icon: <UnorderedListOutlined />,
    title: '任务中心',
    sortOrder: 1,
    children: [
      { key: 'project-list', icon: <FolderOutlined />, title: '项目列表', path: '/project/list', sortOrder: 1 },
      { key: 'task-list', icon: <TeamOutlined />, title: '任务列表', path: '/task/todo', sortOrder: 2 }
    ]
  },
  {
    key: 'system',
    icon: <SettingOutlined />,
    title: '系统管理',
    sortOrder: 3,
    children: [
      { key: 'dept', icon: <TeamOutlined />, title: '部门管理', path: '/system/dept', sortOrder: 1 },
      { key: 'role', icon: <TeamOutlined />, title: '角色管理', path: '/system/role', sortOrder: 2 },
      { key: 'user', icon: <UserOutlined />, title: '用户管理', path: '/system/user', sortOrder: 3 }
    ]
  }
]

const getMenuPath = (menus) => {
  const result = {}
  const flatten = (items) => {
    items.forEach(item => {
      if (item.path) {
        let p = item.path
        if (p.startsWith('/')) p = p.substring(1)
        result[item.key] = p
      }
      if (item.children) {
        flatten(item.children)
      }
    })
  }
  flatten(menus)
  return result
}

const menuKeyTitleMap = {
  'dashboard': { title: '首页', path: '/dashboard' },
  'project-list': { title: '项目列表', path: '/project/list' },
  'task-list': { title: '任务列表', path: '/task/todo' },
  'user': { title: '用户管理', path: '/system/user' },
  'role': { title: '角色管理', path: '/system/role' },
  'dept': { title: '部门管理', path: '/system/dept' }
}

const buildMenuKeyTitleMap = (menus) => {
  const map = {}
  const flatten = (items) => {
    items.forEach(item => {
      if (item.path) {
        map[item.key] = { title: item.title, path: item.path }
      }
      if (item.children) {
        flatten(item.children)
      }
    })
  }
  flatten(menus)
  return map
}

const BasicLayout = ({ children, location, history: historyProp }) => {
  const history = historyProp || useHistory()
  const { logout: authLogout, roleId } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const [userInfo, setUserInfo] = useState({})
  const [selectedKeys, setSelectedKeys] = useState([])
  const [openTabs, setOpenTabs] = useState([])
  const [activeTab, setActiveTab] = useState('')
  const [menuData, setMenuData] = useState(() => loadMenusFromStorage() || defaultMenuData)
  const [profileVisible, setProfileVisible] = useState(false)
  const [pwdLoading, setPwdLoading] = useState(false)
  const [profileForm] = Form.useForm()

  const dynamicMenuKeyTitleMap = useMemo(() => buildMenuKeyTitleMap(menuData), [menuData])
  const menuPathMap = useMemo(() => getMenuPath(menuData), [menuData])

  useEffect(() => {
    fetchUserInfo()
    const storedMenus = loadMenusFromStorage()
    if (storedMenus.length > 0) {
      setMenuData(storedMenus)
    }
  }, [])

  useEffect(() => {
    if (location && location.pathname) {
      const path = location.pathname.split('/').filter(Boolean)
      if (path.length > 0) {
        const key = path.join('-')
        setSelectedKeys([key])
        if (dynamicMenuKeyTitleMap[key] && !openTabs.find(t => t.key === key)) {
          setOpenTabs(prev => [...prev, { key, ...dynamicMenuKeyTitleMap[key] }])
        }
        setActiveTab(key)
      }
    }
  }, [location, dynamicMenuKeyTitleMap])

  const fetchUserInfo = async () => {
    try {
      const res = await getUserInfo()
      setUserInfo(res)
    } catch (e) {
      console.error(e)
    }
  }

  const handleMenuClick = ({ key }) => {
    const path = menuPathMap[key]
    if (path) {
      history.push('/' + path)
      setSelectedKeys([key])
      if (dynamicMenuKeyTitleMap[key] && !openTabs.find(t => t.key === key)) {
        setOpenTabs(prev => [...prev, { key, ...dynamicMenuKeyTitleMap[key] }])
      }
      setActiveTab(key)
    }
  }

  const handleTabChange = (key) => {
    setActiveTab(key)
    const tab = openTabs.find(t => t.key === key)
    if (tab) {
      history.push(tab.path)
    }
  }

  const handleTabEdit = (targetKey, action) => {
    if (action === 'remove') {
      const newTabs = openTabs.filter(t => t.key !== targetKey)
      setOpenTabs(newTabs)
      if (activeTab === targetKey && newTabs.length > 0) {
        const lastTab = newTabs[newTabs.length - 1]
        setActiveTab(lastTab.key)
        history.push(lastTab.path)
      }
    }
  }

  const handleLogout = () => {
    Modal.confirm({
      title: '确认退出',
      content: '确定要退出登录吗？',
      onOk: async () => {
        try {
          await logoutApi()
        } catch (e) {}
        authLogout()
        history.push('/login')
      }
    })
  }

  const handleProfileClick = () => {
    setProfileVisible(true)
  }

  const handlePwdSubmit = async () => {
    try {
      const values = await profileForm.validateFields()
      setPwdLoading(true)
      const res = await changePassword({ oldPassword: values.oldPassword, newPassword: values.newPassword })
      if (res.code === 400) {
        message.error(res.message || '原密码错误')
      } else {
        message.success('密码修改成功')
        profileForm.resetFields()
      }
    } catch (e) {
      if (e.errorFields) return
      message.error('密码修改失败')
    } finally {
      setPwdLoading(false)
    }
  }

  const renderMenu = (menus) => {
    return menus.map(item => {
      if (item.children) {
        return (
          <Menu.SubMenu key={item.key} icon={item.icon} title={item.title}>
            {renderMenu(item.children)}
          </Menu.SubMenu>
        )
      }
      return (
        <Menu.Item key={item.key} icon={item.icon}>
          {item.title}
        </Menu.Item>
      )
    })
  }

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" onClick={handleProfileClick}>
        <UserOutlined /> 个人中心
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" onClick={handleLogout}>
        <LogoutOutlined /> 退出登录
      </Menu.Item>
    </Menu>
  )

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} width={220}>
        <div className="logo">{collapsed ? 'X' : 'Xmdex管理系统'}</div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={selectedKeys}
          onClick={handleMenuClick}
        >
          {renderMenu(menuData)}
        </Menu>
      </Sider>
      <Layout>
        <Header className="header">
          <div className="header-left">
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: () => setCollapsed(!collapsed)
            })}
          </div>
          <div className="header-right">
            <Badge count={5}>
              <BellOutlined className="bell-icon" />
            </Badge>
            <Dropdown overlay={userMenu} placement="bottomRight">
              <div className="user-info">
                <Avatar icon={<UserOutlined />} src={userInfo?.avatar} />
                <span className="username">{userInfo?.nickName || userInfo?.userName || '用户'}</span>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content className="content">
          {openTabs.length > 0 ? (
            <Tabs
              activeKey={activeTab}
              onChange={handleTabChange}
              onEdit={handleTabEdit}
              type="editable-card"
              hideAdd
              style={{ marginBottom: 0 }}
            >
              {openTabs.map(tab => (
                <TabPane tab={tab.title} key={tab.key} closable={openTabs.length > 1} />
              ))}
            </Tabs>
          ) : null}
          <div className="page-content">
            {children}
          </div>
        </Content>
      </Layout>

      <Modal
        title="个人中心"
        open={profileVisible}
        onCancel={() => { setProfileVisible(false); profileForm.resetFields() }}
        footer={null}
        width={520}
        destroyOnClose
      >
        <div className="profile-section">
          <div className="profile-header">
            <Avatar size={64} icon={<UserOutlined />} src={userInfo?.avatar} />
            <div className="profile-name">{userInfo?.nickName || userInfo?.userName || '用户'}</div>
          </div>
          <Descriptions column={1} bordered size="small" style={{ marginTop: 16 }}>
            <Descriptions.Item label="登录账号">{userInfo?.userName || userInfo?.username || '-'}</Descriptions.Item>
            <Descriptions.Item label="用户姓名">{userInfo?.nickName || userInfo?.name || '-'}</Descriptions.Item>
            <Descriptions.Item label="手机号码">{userInfo?.phone || '-'}</Descriptions.Item>
            <Descriptions.Item label="邮箱">{userInfo?.email || '-'}</Descriptions.Item>
            <Descriptions.Item label="所属部门">{userInfo?.orgName || userInfo?.orgId || '-'}</Descriptions.Item>
          </Descriptions>
        </div>
        <div className="pwd-section">
          <div className="pwd-title"><LockOutlined /> 修改密码</div>
          <Form form={profileForm} layout="vertical" onFinish={handlePwdSubmit} style={{ marginTop: 12 }}>
            <Form.Item name="oldPassword" label="原密码" rules={[{ required: true, message: '请输入原密码' }]}>
              <Input.Password placeholder="请输入原密码" />
            </Form.Item>
            <Form.Item name="newPassword" label="新密码" rules={[{ required: true, message: '请输入新密码' }, { min: 6, message: '密码至少6位' }]}>
              <Input.Password placeholder="请输入新密码" />
            </Form.Item>
            <Form.Item name="confirmPassword" label="确认密码" dependencies={['newPassword']} rules={[
              { required: true, message: '请确认新密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) return Promise.resolve()
                  return Promise.reject(new Error('两次密码输入不一致'))
                }
              })
            ]}>
              <Input.Password placeholder="请确认新密码" />
            </Form.Item>
            <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
              <button type="submit" className="pwd-submit-btn" disabled={pwdLoading}>
                {pwdLoading ? '提交中...' : '确认修改'}
              </button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </Layout>
  )
}

export default withRouter(BasicLayout)