import AppLayout from "../components/Layout"

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"))

  return (
    <AppLayout>
      <h1>Welcome, {user?.username}!</h1>
      <p>Role: {user?.role}</p>
    </AppLayout>
  )
}

export default Dashboard