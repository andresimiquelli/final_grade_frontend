import React from 'react';
import { Route, Routes } from 'react-router-dom';
import DefaultLayout from '../pages/DefaultLayout';

import Dashboard from '../pages/Dashboard';
import Students from '../pages/Students';
import Users from '../pages/Users';
import Subjects from '../pages/Subjects';

const AppRoutes: React.FC = () => {
    return (
        <DefaultLayout>
            <Routes>
                <Route path='/' element={<Dashboard/>} />
                <Route path='users' element={<Users/>} />
                <Route path='students' element={<Students/>} />
                <Route path='subjects' element={<Subjects/>} />
            </Routes>
        </DefaultLayout>
    );
}

export default AppRoutes;