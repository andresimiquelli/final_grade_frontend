import React, { useState } from 'react';
import DefaultTable from '../../components/DefaultTable';
import FrameModal from '../../components/FrameModal';
import courseType from '../../services/apiTypes/Course';
import { courseLevelRederer } from '../../utils/courseLevelRenderer';

interface CourseFrameProps {
    show?: boolean;
    handleSelect?(course: courseType): void;
    handleClose?(): void;
}

const CourseFrame: React.FC<CourseFrameProps> = ({ show, handleClose, handleSelect }) => {

    const[courses,setCourses] = useState([] as courseType[])

    function handleShowResult(lCourses: courseType[]) {
        setCourses(lCourses)
    }

    function showTable() {
        return (
            <DefaultTable
                selectionMode={true}>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Tipo</th>
                    </tr>
                </thead>
                <tbody>
                {
                    courses.map(course => 
                        <tr key={course.id} onClick={() => handleSelect&& handleSelect(course)}>
                            <td>{course.name}</td>
                            <td>{courseLevelRederer(course.level)}</td>
                        </tr>    
                    )
                }
                </tbody>
            </DefaultTable>
        )
    }

    return (
        <FrameModal<courseType>
            show={show}
            title="Selecionar curso"
            searchField='name'
            searchOperator='like'
            searchPlaceholder='Buscar curso'
            endpoint='/courses'
            handleShowResult={handleShowResult}
            handleClose={handleClose}>
            { showTable() }
        </FrameModal>
    );
}

export default CourseFrame;