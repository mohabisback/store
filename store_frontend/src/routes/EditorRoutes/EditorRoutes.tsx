import { Route, Routes } from "react-router-dom"
import Error from "../../routes/pages/ErrorPage"
import AuthorizePages from "../../utils/AuthorizePages"
import AddProductPage from "./pages/AddEditProductPage"
import TablePage from "./pages/CategoriesPage"

const EditorRoutes = () => {
  return(
    <AuthorizePages
      roles={['admin', 'admin', 'editor', 'user']}
      failTo={'/'}
    >
      <Routes>
        <Route 
          path='/add-product'
          element={<AddProductPage/>}
        />
        <Route 
          path='/categories'
          element={<TablePage/>}
        />
        <Route 
          path='/*'
          element={<Error />}
        />
      </Routes>
    </AuthorizePages>
  )
}
export default EditorRoutes