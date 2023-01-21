import { Route, Routes } from "react-router-dom"
import Error from "../../components/pages/ErrorPage"
import AuthorizePages from "../../components/AuthorizePages"
import AddProductPage from "./pages/AddProductPage"
import CategoriesPage from "./pages/CategoriesPage"

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
          element={<CategoriesPage/>}
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