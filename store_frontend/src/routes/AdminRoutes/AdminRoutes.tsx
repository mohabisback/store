import { Route, Routes } from "react-router-dom"
import Error from "../../routes/pages/ErrorPage"
import AuthorizePages from "../../utils/AuthorizePages"
import RolesPage from "./pages/RolesPage"
import SchemasPage from "./pages/SchemasPage"
import SchemaPage from "./pages/SchemaPage"

const ServiceRoutes = () => {
  return(
    <AuthorizePages
      roles={['admin', 'admin', 'user']}
      failTo={'/'}
    >
      <Routes>
      <Route 
          path='/schemas'
          element={<SchemasPage/>}
        />
      <Route 
          path='/schema/:id'
          element={<SchemaPage/>}
        />
        <Route 
          path='/roles'
          element={<RolesPage/>}
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