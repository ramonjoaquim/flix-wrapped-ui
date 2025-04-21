import './App.css'
import React from "react";
import AppRoutes from "./AppRoutes";
import { GoogleOAuthProvider } from '@react-oauth/google';

const App: React.FC = () => {
  return (
    <GoogleOAuthProvider clientId="1042726365728-kbt81pvgjkagcqjfobv239m9kejumd6b.apps.googleusercontent.com">
      <AppRoutes></AppRoutes>
    </GoogleOAuthProvider>
  )
};

export default App;
