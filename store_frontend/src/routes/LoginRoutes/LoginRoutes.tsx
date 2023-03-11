import { Route, Routes } from "react-router-dom"
import Error from "../../routes/pages/ErrorPage"
import LoginPage from "./pages/LoginPage"
import ResetPasswordQuest from './pages/ResetPasswordQuestPage';
import RegisterPage from "./pages/RegisterPage"
import ResetPasswordPage from "./pages/ResetPasswordPage"
import VerifyEmailPage from "./pages/VerifyEmailPage"


const LoginRoutes = () => {

  return(
    <Routes>
      <Route
        index
        element={<LoginPage />}
      />
      <Route
        path='/register'
        element={<RegisterPage />}
      />
      <Route
        path='/verify-email'
        element={<VerifyEmailPage />}
      />
      <Route
        path='/reset-password-quest'
        element={<ResetPasswordQuest />}
      />
      <Route
        path='/reset-password'
        element={<ResetPasswordPage />}
      />
      <Route
        path='/*'
        element={<Error />}
      />
    </Routes>
  )
}
export default LoginRoutes