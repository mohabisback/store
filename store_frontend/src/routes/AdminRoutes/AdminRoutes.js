import { Route, Routes } from "react-router-dom"
import Error from "../../components/pages/ErrorPage"
import AuthorizePages from "../../components/AuthorizePages"
import AlterRolePage from "./pages/AlterRolePage"

const ServiceRoutes = () => {
  return(
    <AuthorizePages
      roles={['admin', 'admin', 'user']}
      failTo={'/'}
    >
      <Routes>
        <Route 
          path='/alter-role'
          element={<AlterRolePage/>}
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