import { Route, Routes } from "react-router-dom"
import Error from "../../components/pages/ErrorPage"
import AuthorizePages from "../../components/AuthorizePages"
import AccountPage from "./pages/AccountPage"
import OrdersPage from "./pages/OrdersPage"
import Addresses from "./pages/AddressesPage"
import FavoritesPage from "./pages/FavoritesPage"

const UserRoutes = () => {
  return(
    <AuthorizePages
      roles={['admin', 'admin', 'editor', 'service', 'user']}
      failTo={'/'}
    >
      <Routes>
      <Route 
          path='/account'
          element={<AccountPage/>}
        />
        <Route 
          path='/orders'
          element={<OrdersPage/>}
        />
      <Route 
        path='/addresses'
        element={<Addresses/>}
      />
      <Route 
        path='/favorites'
        element={<FavoritesPage/>}
      />
        <Route 
          path='/*'
          element={<Error />}
        />
      </Routes>
    </AuthorizePages>
  )
}
export default UserRoutes