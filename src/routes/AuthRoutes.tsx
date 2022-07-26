import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Login from '../pages/Login';

const AuthRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path='/' element={<Login/>} />
            <Route element={<Login/>} />
        </Routes>
    );
}

export default AuthRoutes;