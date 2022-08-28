import React from 'react';
import { Route, Routes } from 'react-router-dom';
import TeacherLayout from '../layouts/TeacherLayout';
import Evaluations from '../pages/Classes/Evaluations';
import Lessons from '../pages/Lessons';
import MyClasses from '../pages/MyClasses';

const TeacherRoutes: React.FC = () => {
    return (
        <TeacherLayout>
            <Routes>
                <Route path='/' element={<MyClasses/>} />
                <Route path='lessons/:class_id/:subject_id' element={<Lessons />} />
                <Route path='evaluations/:class_id/:subject_id' element={<Evaluations />} />
            </Routes>
        </TeacherLayout>
    );
}

export default TeacherRoutes;