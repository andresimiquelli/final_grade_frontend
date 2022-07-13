import React, { useState } from 'react';
import DefaultTable from '../../components/DefaultTable';
import FrameModal from '../../components/FrameModal';
import classType from '../../services/apiTypes/Class';
import { dateRenderer } from '../../utils/dateRenderer';

interface ClassFrameProps {
    show?: boolean;
    handleSelect?(cclass: classType): void;
    handleClose?(): void;
}

const ClassFrame: React.FC<ClassFrameProps> = ({ show, handleClose, handleSelect }) => {

    const[classes,setClasses] = useState<classType[]>([])

    function handleResults(nClasses: classType[]) {
        setClasses(nClasses)
    }

    function showTable() {
        return (
            <DefaultTable selectionMode>
                <thead>
                    <tr>
                        <th>Turma</th>
                        <th>Curso</th>
                        <th>Início</th>
                        <th>Término</th>
                    </tr>
                </thead>
                <tbody>
                {
                    classes.map(cclass => 
                        <tr key={cclass.id} onClick={() => handleSelect&& handleSelect(cclass)}>
                            <td>{cclass.name}</td>
                            <td><small>{cclass.pack?.course?.name}</small></td>
                            <td>{dateRenderer(cclass.start_at)}</td>
                            <td>{dateRenderer(cclass.end_at)}</td>
                        </tr>    
                    )
                }   
                </tbody>
            </DefaultTable>
        )
    }

    return (
        <FrameModal<classType>
            title="Selecionar turma"
            show={show}
            endpoint='/classes'
            searchField='name'
            searchOperator='like'
            searchPlaceholder='Buscar turma'
            withFields={['pack.course']}
            handleShowResult={handleResults}
            handleClose={handleClose}>
            { showTable() }
        </FrameModal>
    );
}

export default ClassFrame;