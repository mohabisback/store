import React from 'react'
import GlobalContexts from './contexts/GlobalContexts.js';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home.js'
import About from './pages/About.js'
import Upload from './pages/Upload.js'
import OneRestaurant from './pages/OneRestaurant.js'
import Error from './pages/Error.js'
import SharedLayout from './components/SharedLayout.js'
import Restaurants from './components/Restaurants.js'
import Register from './pages/Register.js'
import Login from './pages/Login.js'
import Dashboard from './pages/Dashboard.js'
import VerifyEmail from './pages/VerifyEmail.js';
import ResetPasswordQuest from './pages/ResetPasswordQuest.js'
import ResetPassword from './pages/ResetPassword.js'
import CustomerChat from './components/customerChat/CustomerChat.js'
import Authorize from './components/Authorize.js';
import GlobalStyles from './globalStyles/GlobalStyles'
import { library } from "@fortawesome/fontawesome-svg-core";
import { faLink, faCircleInfo, faEnvelopeOpenText, faHouseChimney, faUtensils } from "@fortawesome/free-solid-svg-icons"
import { faAnglesUp, faAnglesLeft, faAnglesRight, faAnglesDown, faDiagramProject } from '@fortawesome/free-solid-svg-icons';
import { faUserCheck } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faGithub, faLinkedin, faTwitter, faWordpress, faYoutube } from '@fortawesome/free-brands-svg-icons'

library.add( faLink, faCircleInfo, faEnvelopeOpenText, faHouseChimney, faUtensils );
library.add(faAnglesUp, faAnglesLeft, faAnglesRight, faAnglesDown, faDiagramProject);
library.add( faUserCheck );
library.add( faFacebook, faGithub, faLinkedin, faTwitter, faWordpress, faYoutube  );

function App() {

  return (
    <GlobalContexts>
      <GlobalStyles >
        <BrowserRouter>
        <Routes>
          <Route path='/' element={<SharedLayout/>}>
            <Route index element={<Home/>}/>
            <Route path='/about' element={<About/>}/>
            <Route path='/upload' element={<Upload/>}/>
            <Route path='/restaurants' element={<Restaurants/>}/>
            <Route path='/restaurants/:param' element={<OneRestaurant/>}/>
            <Route path='/user/register' element={<Register/>}/>
            <Route path='/user/login' element={<Login />}/>
            <Route path='/user/verify-email' element={<VerifyEmail />}/>
            <Route path='/user/reset-password-quest' element={<ResetPasswordQuest />}/>
            <Route path='/user/reset-password' element={<ResetPassword />}/>
            <Route path='/user/dashboard' element={<Authorize role='user' Component={Dashboard} />} />
            <Route path='*' element={<Error/>}/>
          </Route>
          <Route path='/customer-chat' element={<Authorize role='service' component={CustomerChat}/>} />
        </Routes>
        </BrowserRouter>
      </GlobalStyles>
    </GlobalContexts>
  );
}

export default App;
