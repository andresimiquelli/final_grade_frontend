import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import LoadingContainer from '../../../../../components/LodingContainer';
import packModuleSubjectType from '../../../../../services/apiTypes/PackModuleSubject';
import subjectType from '../../../../../services/apiTypes/Subject';
import { useAuth } from '../../../../../context/auth';
import { useApi } from '../../../../../services/api';

import { InputBox } from './styles';
import errorType from '../../../../../services/apiTypes/Error';
import ErrorScreen from '../../../../../components/ErrorScreen';
import { extractError } from '../../../../../utils/errorHandler';

type dataType = {
    pack_module_id?: number;
    subject_id?: number;
    load: number;
    order?: number;
}

interface ModuleSubjectFormProps {
    show?: boolean;
    selectedSubject?: subjectType;
    moduleSubject?: packModuleSubjectType;
    packModuleId: number;
    packId: number;
    handleClose?(): void;
    handleSave?(subject: packModuleSubjectType): void;
    handleUpdate?(subject: packModuleSubjectType): void;
}

const ModuleSubjectForm: React.FC<ModuleSubjectFormProps> = ( props ) => {

    const { token } = useAuth()
    const api = useApi(token)

    const[hours,setHours] = useState(0)
    const[mins,setMins] = useState(0)

    const[isLoading,setIsLoading] = useState(false)

    const[hasError,setHasError] = useState(false)
    const[error,setError] = useState<errorType | undefined>()

    useEffect(() => {
        if(props.moduleSubject) {
            setHours(props.moduleSubject.load > 59? Math.floor(props.moduleSubject.load/60) : 0)
            setMins(props.moduleSubject.load > 59? props.moduleSubject.load%60 : props.moduleSubject.load)
        } else {
            setHours(0)
            setMins(0)
        }
    },[props.moduleSubject])

    function close() {
        setHasError(false)
        props.handleClose&& props.handleClose()
    }

    function handleMins(m: number) {
        if(m>59) {
            setHours(Math.floor(m/60))
            setMins(m%60)
        } else {
            setMins(m)
        }
    }

    function getData(): dataType {
        let data = {} as dataType
            data.load = (hours*60)+mins

            if(!props.moduleSubject) {
                data.pack_module_id = props.packModuleId
                data.subject_id = props.selectedSubject?.id
                data.order = 0
            }

        return data
    }

    function save(e: React.FormEvent) {
        e.preventDefault()

        if(props.moduleSubject)
            update()
        else
            saveNew()
    }

    function saveNew() {
        let data = getData()
        api.post(`/packs/${props.packId}/modules/${props.packModuleId}/subjects`,data)
        .then(
            response => {
                props.handleSave&& props.handleSave(response.data)
                close()
            }
        )
        .finally(
            () => setIsLoading(false)
        )
        .catch(
            error => {
                setError(extractError(error))
                setHasError(true)
            }
        )
    }

    function update() {
        let data = getData()
        api.put(`/packs/${props.packId}/modules/${props.packModuleId}/subjects/${props.moduleSubject?.id}`,data)
        .then(
            response => {
                props.handleUpdate&& props.handleUpdate(response.data)
                close()
            }
        )
        .finally(
            () => setIsLoading(false)
        )
        .catch(
            error => {
                setError(extractError(error))
                setHasError(true)
            }
        )
    }

    return (
        <Modal show={props.show} onHide={close}>
            <Modal.Header>
                <Modal.Title>{props.moduleSubject? 'Editar carga horária' : 'Adicionar disciplina'}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={save}>
                <Modal.Body className='position-relative'>
                    <LoadingContainer show={isLoading}/>
                    <ErrorScreen show={hasError} handleClose={() => setHasError(false)} error={error}/> 
                    <Form.Group>
                        <h6>{props.selectedSubject? props.selectedSubject.name : props.moduleSubject? props.moduleSubject.subject.name : ''}</h6>
                    </Form.Group>
                    <Form.Group className='mb-2'>
                        <InputBox>
                            <Form.Control 
                                type='number' 
                                placeholder='Horas'
                                min={0}
                                onChange={(e) => setHours(parseInt(e.target.value))}
                                value={hours}
                                required/>
                            <Form.Control 
                                type='number' 
                                placeholder='Minutos'
                                min={0}
                                onChange={(e) => handleMins(parseInt(e.target.value))}
                                value={mins}
                                required/>
                        </InputBox>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button 
                        variant='secondary'
                        onClick={close}>
                            Cancelar
                    </Button>
                    <Button type='submit'>Salvar</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default ModuleSubjectForm;