import React, { useState } from 'react';
import DefaultTable from '../../components/DefaultTable';
import FrameModal from '../../components/FrameModal';
import subjectType from '../../services/apiTypes/Subject';

interface SubjectFrameProps {
    show?: boolean;
    handleSelect?(subject: subjectType): void;
    handleClose?(): void;
}

const SubjectFrame: React.FC<SubjectFrameProps> = ({ show, handleSelect, handleClose }) => {

    const[subjects,setSubjects] = useState<subjectType[]>([])

    function handleResults(nSubjects: subjectType[]) {
        setSubjects(nSubjects)
    }

    function showTable() {
        return (
            <DefaultTable selectionMode>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Descrição</th>
                    </tr>
                </thead>
                <tbody>
                {
                    subjects.map(subject => 
                        <tr key={subject.id} onClick={() => handleSelect&& handleSelect(subject)}>
                            <td>{subject.name}</td>
                            <td>{subject.description}</td>
                        </tr>    
                    )
                }
                </tbody>
            </DefaultTable>
        )
    }

    return (
        <FrameModal<subjectType> 
            show={show}
            endpoint='/subjects'
            searchField='name'
            handleShowResult={handleResults}
            title='Selecionar disciplina'
            searchOperator='like'
            searchPlaceholder='Buscar disciplina'
            handleClose={handleClose}>
                { showTable() }
        </FrameModal>
    );
}

export default SubjectFrame;