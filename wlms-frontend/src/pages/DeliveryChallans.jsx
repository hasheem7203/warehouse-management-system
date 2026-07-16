import { useEffect, useState } from "react"
import { Table, Tag } from "antd"
import AppLayout from "../components/Layout"
import api from "../api/axios"

function DeliveryChallans() {
  const [challans, setChallans] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get("/delivery-challans")
      .then(res => { setChallans(res.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const statusColors = {
    Pending:    "orange",
    Dispatched: "blue",
    Delivered:  "green",
    Failed:     "red"
  }

  const columns = [
    { title: "DC ID",          dataIndex: "dc_id",          key: "dc_id" },
    { title: "SO ID",          dataIndex: "so_id",          key: "so_id" },
    { title: "Customer",       dataIndex: "customer_name",  key: "customer_name" },
    { title: "Driver",         dataIndex: "driver_name",    key: "driver_name" },
    { title: "Vehicle",        dataIndex: "vehicle_number", key: "vehicle_number" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color={statusColors[status]}>{status}</Tag>
    },
    { title: "Created At",     dataIndex: "created_at",     key: "created_at" },
  ]

  return (
    <AppLayout>
      <h2 style={{ marginBottom: "16px" }}>Delivery Challans</h2>
      <Table dataSource={challans} columns={columns} rowKey="dc_id" loading={loading} />
    </AppLayout>
  )
}

export default DeliveryChallans