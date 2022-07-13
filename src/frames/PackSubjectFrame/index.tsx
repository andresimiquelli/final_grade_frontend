import React, { useState } from 'react';
import { Accordion } from 'react-bootstrap';
import DefaultTable from '../../components/DefaultTable';
import FrameModal from '../../components/FrameModal';
import packType from '../../services/apiTypes/Pack';
import packModuleType from '../../services/apiTypes/PackModule';
import packModuleSubjectType from '../../services/apiTypes/PackModuleSubject';

interface PackSubjectFrameProps {
    show?: boolean;
    handleSelect?(subject: packModuleSubjectType): void;
    handleClose?(): void;
    pack?: packType;
}

const PackSubjectFrame: React.FC<PackSubjectFrameProps> = ({ show, handleClose, handleSelect, pack }) => {
    
    const[modules,setModules] = useState<packModuleType[]>([])

    function handleResult(nModules: packModuleType[]) {
        setModules(nModules)
    }

    function showTable() {
        return(
            <Accordion>
            {
                modules.map((module, index) => 
                    <Accordion.Item eventKey={index.toString()} key={"module_"+module.id}>
                        <Accordion.Header>{module.name}</Accordion.Header>
                        <Accordion.Body>
                            <DefaultTable selectionMode>
                                <tbody>
                                {
                                    module.subjects?.map(subject => 
                                        <tr key={'sub_'+subject.id} onClick={() => handleSelect&& handleSelect(subject)}>
                                            <td>{subject.subject.name}</td>
                                        </tr>
                                    )
                                }
                                </tbody>
                            </DefaultTable>
                        </Accordion.Body>
                    </Accordion.Item>
                )
            }
                
            </Accordion>
        )
    }
    
    return (
        <FrameModal
            title='Selecionar disciplina'
            show={show}
            endpoint={`/packs/${pack?.id}/modules`}
            withFields={['subjects.subject']}
            handleShowResult={handleResult}
            handleClose={handleClose}
            subheader={<h6>{pack?.name}</h6>}>
            { showTable() }
        </FrameModal>
    );
}

export default PackSubjectFrame;