import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { useAuth } from '../../contexts/AuthContext';

const AuthWrapper: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login, adminLogin, register } = useAuth();

  return (
    <div className="min-h-screen bg-deep-black flex items-center justify-center p-4">
      {isLogin ? (
        <LoginForm 
          onLogin={login}
          onAdminLogin={adminLogin}
          onSwitchToRegister={() => setIsLogin(false)}
        />
      ) : (
        <RegisterForm 
          onRegister={register}
          onSwitchToLogin={() => setIsLogin(true)}
        />
      )}
    </div>
  );
};

export default AuthWrapper;