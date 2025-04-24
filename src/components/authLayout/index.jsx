import React, { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from 'react-router-dom';

const AuthLayout = ({children}) => {
   const { user } = useAuth();
   const navigate = useNavigate();
   console.log(user);
   useEffect(()=>{
    if (user?.uid) {
      navigate('/dashboard');
    }
   },[user]);
  return(
    <div>
      {children}
    </div>
  );
}

export default AuthLayout;