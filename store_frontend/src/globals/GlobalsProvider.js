//Google OAuth
import { GoogleOAuthProvider } from '@react-oauth/google';
import { FacebookProvider } from 'react-facebook';

//contexts
import { SignedUserContextProvider } from './contexts/SignedUserContext';
import { ThemeContextProvider } from './contexts/ThemeContext';
import { CartItemsContextProvider } from './contexts/CartItemsContext';
import { CategoriesContextProvider } from './contexts/CategoriesContext';
import { DialogContextProvider } from './contexts/DialogContext';

//styles
import React from 'react';
import { ThemeProvider } from 'styled-components';
import Reset from './styles/ResetStyle.js';
import ThemeContext from './contexts/ThemeContext.js';
import defaultTheme from './styles/themes/defaultTheme';
import setFontAwesomeIcons from './icons/setFontAwesomeIcons';
import Dialog from './components/Dialog';

const GlobalsProvider = ({ children }) => {
  const { theme } = React.useContext(ThemeContext);

  setFontAwesomeIcons();

  return (
    <GoogleOAuthProvider clientId='681391366984-snidjkil3iemc3dl5g5ijl3a0brphufl.apps.googleusercontent.com'>
      <FacebookProvider
        appId='916372296191262'
        lazy
      >
        {/*Contexts*/}
        <SignedUserContextProvider>
          <ThemeContextProvider>
            <CartItemsContextProvider>
              <CategoriesContextProvider>
                <DialogContextProvider>

                {/*styles*/}
                <ThemeProvider theme={theme || defaultTheme}>
                  <Reset />
                  
                  {children}
                  
                  <Dialog />
                </ThemeProvider>
                
                </DialogContextProvider>
              </CategoriesContextProvider>
            </CartItemsContextProvider>
          </ThemeContextProvider>
        </SignedUserContextProvider>

      </FacebookProvider>
    </GoogleOAuthProvider>
  );
};

export default GlobalsProvider;
