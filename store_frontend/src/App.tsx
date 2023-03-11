import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SharedLayout from './SharedLayout/SharedLayout';
import HomePage from './routes/HomePage/HomePage';
import GlobalsProvider from './GlobalsProvider';
import UserRoutes from './routes/UserRoutes/UserRoutes';
import LoginRoutes from './routes/LoginRoutes/LoginRoutes';
import EditorRoutes from './routes/EditorRoutes/EditorRoutes';
import ServiceRoutes from './routes/ServiceRoutes/ServiceRoutes';
import AdminRoutes from './routes/AdminRoutes/AdminRoutes';
import StoreRoutes from './routes/StoreRoutes/StoreRoutes';
import ThemeContext from './contexts/ThemeContext';
function App() {
  const {theme} = React.useContext(ThemeContext); const W = theme.width;
  return (
    <GlobalsProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path='/'
            element={<SharedLayout />}
          >
            <Route
              index
              element={<HomePage/>}
            />
            <Route
              path='/login/*'
              element={<LoginRoutes/>}
            />
            <Route
              path='/user/*'
              element={<UserRoutes/>}
            />
            <Route
              path='/editor/*'
              element={<EditorRoutes/>}
            />
            <Route
              path='/service/*'
              element={<ServiceRoutes/>}
            />
            <Route
              path='/admin/*'
              element={<AdminRoutes/>}
            />
            <Route
              path='/*'
              element={<StoreRoutes/>}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </GlobalsProvider>
  );
}

export default App;
