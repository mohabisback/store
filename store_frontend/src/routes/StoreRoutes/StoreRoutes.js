import { Route, Routes } from "react-router-dom"
import Error from "../../components/pages/ErrorPage"
import HomePage from "../../HomePage.js/HomePage"
import AboutPage from "./pages/AboutPage"
import CartPage from "./pages/CartPage"
import ProductPage from "./pages/ProductPage"
import SearchPage from "./pages/SearchPage"


const StoreRoutes = () => {

  return(
    <Routes>
      <Route
        index
        element={<HomePage />}
      />
      <Route
        path='/about'
        element={<AboutPage />}
      />
      <Route
        path='/about'
        element={<SearchPage />}
      />
      <Route 
        path='/cart'
        element={<CartPage/>}
      />
      <Route 
        path='/:product'
        element={<ProductPage/>}
      />
      <Route
        path='/*'
        element={<Error />}
      />
    </Routes>
  )
}
export default StoreRoutes