import { Route, Routes } from "react-router-dom"
import Error from "../../components/pages/ErrorPage"
import AuthorizePages from "../../components/AuthorizePages"
import CustomerChatPage from "./pages/CustomerChatPage"

const ServiceRoutes = () => {
  return(
    <AuthorizePages
      roles={['admin', 'admin', 'editor', 'user']}
      failTo={'/'}
    >
      <Routes>
        <Route 
          path='/customer-Chat'
          element={<CustomerChatPage/>}
        />
        <Route 
          path='/*'
          element={<Error />}
        />
      </Routes>
    </AuthorizePages>
  )
}
export default ServiceRoutes