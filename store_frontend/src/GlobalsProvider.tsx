//Google OAuth
import { GoogleOAuthProvider } from '@react-oauth/google';
import { FacebookProvider } from 'react-facebook';

//contexts
import { SignedUserProvider } from './contexts/SignedUserContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { WindowProvider } from './contexts/WindowContext';
import { CartItemsProvider } from './contexts/CartItemsContext';
import { CategoriesProvider } from './contexts/CategoriesContext';
import { DialogProvider } from './contexts/DialogContext';
import { CropperProvider } from './contexts/CropperContext';
import { TooltipProvider } from './contexts/TooltipContext';
import { MessageProvider } from './contexts/MessageContext';

//styles
import React from 'react';
import Dialog from './components/Dialog';
import Cropper from './components/Cropper';
import Tooltip from './components/Tooltip';
import Message from './components/Message';
import ResetStyles from './styles/reset/reset';

const GlobalsProvider = ({ children }:{children:React.ReactNode}) => {

  return (
    <GoogleOAuthProvider clientId='681391366984-snidjkil3iemc3dl5g5ijl3a0brphufl.apps.googleusercontent.com'>
      <FacebookProvider
        appId='916372296191262'
        lazy
      >
        {/*Contexts*/}
        <SignedUserProvider>
          <ThemeProvider>
            <WindowProvider>
            <CartItemsProvider>
              <CategoriesProvider>
                <DialogProvider>
                <CropperProvider>
                  <TooltipProvider>
                    <MessageProvider>

                      <ResetStyles/>          
              		    {children}                  
                      <Dialog />               
                      <Cropper />
                      <Tooltip />
                      <Message />

                    </MessageProvider>
                  </TooltipProvider>
                </CropperProvider>
                </DialogProvider>
              </CategoriesProvider>
            </CartItemsProvider>
            </WindowProvider>
          </ThemeProvider>
        </SignedUserProvider>

      </FacebookProvider>
    </GoogleOAuthProvider>
  );
};

export default GlobalsProvider;
