import React from 'react';
import { HashRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { useAuth } from '../context/auth';
import AuthRoutes from './AuthRoutes';

const Routes: React.FC = () => {

    const { token } = useAuth()

    return (
        <HashRouter>
            { token.length>0 ? <AppRoutes /> : <AuthRoutes />}            
        </HashRouter>
    );
}

export default Routes;