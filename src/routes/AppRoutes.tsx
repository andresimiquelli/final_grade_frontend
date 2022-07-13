import React from 'react';
import { Route, Routes } from 'react-router-dom';
import DefaultLayout from '../pages/DefaultLayout';

import Dashboard from '../pages/Dashboard';
import Students from '../pages/Students';
import Users from '../pages/Users';
import Subjects from '../pages/Subjects';
import Courses from '../pages/Courses';
import Teachers from '../pages/Teachers';
import Packs from '../pages/Packs';
import Modules from '../pages/Packs/Modules';
import ModuleSubjects from '../pages/Packs/Modules/ModuleSubjects';
import Classes from '../pages/Classes';
import Assignments from '../pages/Teachers/Assignments';

const AppRoutes: React.FC = () => {
    return (
        <DefaultLayout>
            <Routes>
                <Route path='/' element={<Dashboard/>} />
                <Route path='users' element={<Users/>} />
                <Route path='students' element={<Students/>} />
                <Route path='subjects' element={<Subjects/>} />
                <Route path='courses' element={<Courses/>} />
                <Route path='teachers' element={<Teachers/>} />
                <Route path='teachers/:teacher_id/assignments' element={<Assignments/>} />
                <Route path='classes' element={<Classes/>} />
                <Route path='packs' element={<Packs/>} />
                <Route path='packs/:pack_id/modules' element={<Modules/>} />
                <Route path='packs/:pack_id/modules/:module_id/subjects' element={<ModuleSubjects/>} />
            </Routes>
        </DefaultLayout>
    );
}

export default AppRoutes;