import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import enrollmentType from '../../../../services/apiTypes/Enrollment';
import errorType from '../../../../services/apiTypes/Error';
import studentType from '../../../../services/apiTypes/Student';
import { useAuth } from '../../../../context/auth';
import { useApi } from '../../../../services/api';
import classType from '../../../../services/apiTypes/Class';
import LoadingContainer from '../../../../components/LodingContainer';
import ErrorScreen from '../../../../components/ErrorScreen';

interface EnrollmentFormProps {
    show?: boolean;
    student?: studentType;
    cclass?: classType;
    enrollment?: enrollmentType;
    handleClose?(): void;
    handleSave?(enrollment: enrollmentType): void;
    handleUpdate?(enrollment: enrollmentType): void;
}

type dataType = {
    student_id?: number;
    class_id?: number;
    start_at: string;
    end_at?: string;
    status?: number;
}

const EnrollmentForm: React.FC<EnrollmentFormProps> = ( props ) => {

    const { token } = useAuth()
    const api = useApi(token)

    const[start,setStart] = useState('')
    const[end,setEnd] = useState('')
    const[isLoading,setIsLoading] = useState(false)
    const[hasError,setHasError] = useState(false)
    const[error,setError] = useState<errorType | undefined>()
    const[className,setClassName] = useState<string | undefined>('')

    useEffect(() => {
        if(props.enrollment) {
            setStart(props.enrollment.start_at.split(' ')[0])
            setEnd(props.enrollment.end_at? props.enrollment.end_at.split(' ')[0] : '')
            loadClass(props.enrollment.class_id)
        } else {
            setStart('')
            setEnd('')
            setClassName(props.cclass?.name)
        }
    },[props.enrollment,props.cclass])

    function getData() {
        let data = {start_at: start} as dataType

        if(!props.enrollment) {
            data.status = 1
            data.class_id = props.cclass?.id
            data.student_id = props.student?.id
        }

        if(end.length > 0)
            data.end_at = end

        return data
    }

    function loadClass(id: number) {
        api.get('/classes/'+id)
        .then(
            response => {
                setClassName(response.data.name)
            }
        )
    }
    
    function save(e: React.FormEvent) {
        e.preventDefault()
        setIsLoading(true)
        if(props.enrollment)
            upate()
        else
            saveNew()
    }

    function saveNew() {
        const data = getData()
        api.post(`/enrollments?with=cclass`, data)
        .then(
            response => {
                props.handleSave&&
                    props.handleSave(response.data)

                props.handleClose&&
                    props.handleClose()
            }
        )
        .finally(
            () => setIsLoading(false)
        )
    }

    function upate() {
        const data = getData()
        api.put(`/enrollments/${props.enrollment?.id}?with=cclass`, data)
        .then(
            response => {
                props.handleUpdate&&
                    props.handleUpdate(response.data)

                props.handleClose&&
                    props.handleClose()
            }
        )
        .finally(
            () => setIsLoading(false)
        )
    }

    return (
        <Modal show={props.show} onHide={props.handleClose}>
            <Modal.Header>
                <Modal.Title>{props.enrollment? "Editar matrícula" : "Nova matrícula"}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={save}>
                <Modal.Body className='position-relative'>
                    <LoadingContainer show={isLoading} />
                    <ErrorScreen show={hasError} error={error} handleClose={() => setHasError(false)}/>
                    <Form.Group className='mb-2'>
                        <h5>{props.student?.name}</h5>
                        <h6>{className}</h6>
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
                    <Button 
                        variant='secondary' 
                        onClick={props.handleClose}>
                            Cancelar
                        </Button>
                    <Button type='submit'>Salvar</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default EnrollmentForm;