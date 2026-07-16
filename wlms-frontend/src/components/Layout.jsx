import { Layout, Menu } from "antd"
import { useNavigate, useLocation } from "react-router-dom"
import {
  DashboardOutlined,
  ShoppingCartOutlined,
  InboxOutlined,
  TeamOutlined,
  UserOutlined,
  ShopOutlined,
  AppstoreOutlined,
  CarOutlined,
  LogoutOutlined,
  DatabaseOutlined
} from "@ant-design/icons"

const { Sider, Header, Content } = Layout

function AppLayout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem("user"))
  const role = user?.role

  const handleLogout = () => {
    localStorage.clear()
    navigate("/login")
  }

  const allMenuItems = [
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      roles: ["Administrator", "Warehouse Staff", "Logistics Staff"]
    },
    {
      key: "/items",
      icon: <AppstoreOutlined />,
      label: "Items",
      roles: ["Administrator", "Warehouse Staff", "Logistics Staff"]
    },
    {
      key: "/stock",
      icon: <DatabaseOutlined />,
      label: "Stock",
      roles: ["Administrator", "Warehouse Staff", "Logistics Staff"]
    },
    {
      key: "/suppliers",
      icon: <ShopOutlined />,
      label: "Suppliers",
      roles: ["Administrator", "Warehouse Staff"]
    },
    {
      key: "/purchase-orders",
      icon: <ShoppingCartOutlined />,
      label: "Purchase Orders",
      roles: ["Administrator", "Warehouse Staff"]
    },
    {
      key: "/grns",
      icon: <InboxOutlined />,
      label: "Goods Receipts",
      roles: ["Administrator", "Warehouse Staff"]
    },
    {
      key: "/customers",
      icon: <TeamOutlined />,
      label: "Customers",
      roles: ["Administrator", "Logistics Staff"]
    },
    {
      key: "/sales-orders",
      icon: <ShoppingCartOutlined />,
      label: "Sales Orders",
      roles: ["Administrator", "Logistics Staff"]
    },
    {
      key: "/delivery-challans",
      icon: <CarOutlined />,
      label: "Delivery Challans",
      roles: ["Administrator", "Logistics Staff"]
    },
    {
      key: "/users",
      icon: <UserOutlined />,
      label: "Users",
      roles: ["Administrator"]
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      roles: ["Administrator", "Warehouse Staff", "Logistics Staff"],
      danger: true
    }
  ]

  const menuItems = allMenuItems
    .filter(item => item.roles.includes(role))
    .map(({ roles, ...rest }) => rest)  // remove roles before passing to Menu

  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      handleLogout()
    } else {
      navigate(key)
    }
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider theme="dark" width={220}>
        <div style={{
          color: "white",
          textAlign: "center",
          padding: "20px 0",
          fontWeight: "bold",
          fontSize: "16px",
          borderBottom: "1px solid #333"
        }}>
          WLMS
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ marginTop: "8px" }}
        />
      </Sider>

      <Layout>
        <Header style={{
          background: "white",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          boxShadow: "0 1px 4px rgba(0,0,0,0.1)"
        }}>
          <span style={{ marginRight: "8px" }}>{user?.username}</span>
          <span style={{
            background: "#1890ff",
            color: "white",
            padding: "2px 10px",
            borderRadius: "10px",
            fontSize: "12px"
          }}>
            {role}
          </span>
        </Header>

        <Content style={{ padding: "24px", background: "#f0f2f5" }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}

export default AppLayout