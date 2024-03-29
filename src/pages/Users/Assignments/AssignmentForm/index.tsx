import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import classType from '../../../../services/apiTypes/Class';
import packModuleSubjectType from '../../../../services/apiTypes/PackModuleSubject';
import { useAuth } from '../../../../context/auth';
import { useApi } from '../../../../services/api';
import LoadingContainer from '../../../../components/LodingContainer';
import ErrorScreen from '../../../../components/ErrorScreen';
import errorType from '../../../../services/apiTypes/Error';
import { extractError } from '../../../../utils/errorHandler';
import userType from '../../../../services/apiTypes/User';
import userAssignmentType from '../../../../services/apiTypes/UserAssignment';

interface AssignmentFormProps {
    show?: boolean;
    teacher: userType;
    cclass?: classType;
    subject?: packModuleSubjectType;
    assignment?: userAssignmentType;
    handleClose?(): void;
    handleSave?(assignment: userAssignmentType): void;
    handleUpdate?(assignment: userAssignmentType): void;
}

type dataType = {
    class_id?: number;
    pack_module_subject_id?: number;
    start_at: string;
    end_at?: string;
}

const AssignmentForm: React.FC<AssignmentFormProps> = ( props ) => {

    const { token } = useAuth()
    const api = useApi(token)

    const[start,setStart] = useState('')
    const[end,setEnd] = useState('')
    const[isLoading,setIsLoading] = useState(false)
    const[hasError,setHasError] = useState(false)
    const[error,setError] = useState<errorType | undefined>()

    useEffect(() => {
        if(props.assignment) {
            setStart(props.assignment.start_at.split(' ')[0])
            setEnd(props.assignment.end_at? props.assignment.end_at.split(' ')[0] : '')
        } else {
            setStart('')
            setEnd('')
        }
    },[props.assignment])

    function close() {
        setHasError(false)
        props.handleClose&& props.handleClose()
    }

    function save(e: React.FormEvent) {
        e.preventDefault()
        setIsLoading(true)

        if(props.assignment)
            update()
        else
            saveNew()
    }

    function getData() {
        let data = {start_at: start} as dataType

        if(!props.assignment) {
            data.class_id = props.cclass?.id
            data.pack_module_subject_id = props.subject?.id
        }

        if(end.length > 0)
            data.end_at = end

        return data
    }

    function saveNew() {
        let data = getData()
        api.post(`/users/${props.teacher?.id}/assignments`,data)
        .then(
            response => {
                props.handleSave&& props.handleSave(response.data)
                close()
            }
        )
        .finally( () => setIsLoading(false) )
        .catch(
            error => {
                setHasError(true)
                setError(extractError(error))
            }
        )
    }

    function update() {
        let data = getData()
        api.put(`/users/${props.teacher?.id}/assignments/${props.assignment?.id}`,data)
        .then(
            response => {
                props.handleUpdate&& props.handleUpdate(response.data)
                close()
            }
        )
        .finally( () => setIsLoading(false) )
        .catch(
            error => {
                setHasError(true)
                setError(extractError(error))
            }
        )
    }

    return (
        <Modal show={props.show} onHide={close}>
            <Modal.Header>
                <Modal.Title>{props.assignment? 'Editar vínculo' : 'Novo vínculo'}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={save}>
                <Modal.Body className='position-relative'>
                    <LoadingContainer show={isLoading}/>
                    <ErrorScreen show={hasError} error={error} handleClose={() => setHasError(false)}/>
                    <Form.Group className='mb-2'>
                        <h5 className='text-primary'>{props.teacher?.name}</h5>
                    </Form.Group>
                    <Form.Group className='mb-2'>
                        <h6>{props.cclass?.name}</h6>
                    </Form.Group>
                    <Form.Group className='mb-4'>
                        <span>{props.subject?.subject.name}</span>
                    </Form.Group>
                    <Form.Group className='mb-2'>
                        <Form.Label>Início</Form.Label>
                        <Form.Control 
                            required
                            type='date'
                            value={start}
                            onChange={(e) => setStart(e.target.value)}
                            />
                    </Form.Group>
                    <Form.Group className='mb-2'>
                        <Form.Label>Término</Form.Label>
                        <Form.Control 
                            type='date'
                            value={end}
                            onChange={(e) => setEnd(e.target.value)}
                            />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={close}>Cancelar</Button>
                    <Button type='submit'>Salvar</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default AssignmentForm;