import { useEffect, useState } from "react"
import { Table, Tag } from "antd"
import AppLayout from "../components/Layout"
import api from "../api/axios"

function SalesOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get("/sales-orders")
      .then(res => { setOrders(res.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const statusColors = {
    Pending:    "orange",
    Processing: "blue",
    Packed:     "purple",
    Shipped:    "cyan",
    Delivered:  "green",
    Cancelled:  "red"
  }

  const paymentColors = {
    Unpaid:  "red",
    Paid:    "green",
    Partial: "orange"
  }

  const columns = [
    { title: "SO ID",        dataIndex: "so_id",          key: "so_id" },
    { title: "Customer",     dataIndex: "customer_name",  key: "customer_name" },
    { title: "Created By",   dataIndex: "created_by",     key: "created_by" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color={statusColors[status]}>{status}</Tag>
    },
    {
      title: "Payment",
      dataIndex: "payment_status",
      key: "payment_status",
      render: (payment_status) => <Tag color={paymentColors[payment_status]}>{payment_status}</Tag>
    },
    { title: "Created At",   dataIndex: "created_at",     key: "created_at" },
  ]

  return (
    <AppLayout>
      <h2 style={{ marginBottom: "16px" }}>Sales Orders</h2>
      <Table dataSource={orders} columns={columns} rowKey="so_id" loading={loading} />
    </AppLayout>
  )
}

export default SalesOrders