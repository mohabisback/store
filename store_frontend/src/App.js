import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage.js/HomePage.js';
import SharedLayout from './components/SharedLayout.js';
import GlobalsProvider from './globals/GlobalsProvider';
import UserRoutes from './routes/UserRoutes/UserRoutes.js';
import LoginRoutes from './routes/LoginRoutes/LoginRoutes.js';
import EditorRoutes from './routes/EditorRoutes/EditorRoutes.js';
import ServiceRoutes from './routes/ServiceRoutes/ServiceRoutes.js';
import AdminRoutes from './routes/AdminRoutes/AdminRoutes.js';
import StoreRoutes from './routes/StoreRoutes/StoreRoutes.js';

import CategoriesDS from './services/axios/CategoriesDS'

function App() {

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
