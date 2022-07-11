import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import classType from '../../../services/apiTypes/Class';
import { useAuth } from '../../../context/auth';
import { useApi } from '../../../services/api';
import packType from '../../../services/apiTypes/Pack';
import LoadingContainer from '../../../components/LodingContainer';
import ErrorScreen from '../../../components/ErrorScreen';
import errorType from '../../../services/apiTypes/Error';
import { extractError } from '../../../utils/errorHandler';

interface ClassFormProps {
    show?: boolean;
    pack?: packType;
    cClass?: classType;
    handleSave?(cClass: classType): void;
    handleUpdate?(cClass: classType): void;
    handleClose?(): void;
}

type dataType = {
    pack_id?: number;
    name?: string;
    start_at?: string;
    end_at?: string;
}

const ClassForm: React.FC<ClassFormProps> = ({ show, cClass, pack, handleClose, handleSave, handleUpdate }) => {

    const { token } = useAuth()
    const api = useApi(token)

    const[name,setName] = useState('')
    const[startAt,setStartAt] = useState('')
    const[endAt,setEndAt] = useState('')
    const[isLoading,setIsLoading] = useState(false)
    const[hasError,setHasError] = useState(false)
    const[error,setError] = useState<errorType | undefined>()

    useEffect(() => {
        if(cClass) {
            setName(cClass.name)
            setStartAt(cClass.start_at.split(' ')[0])
            if(cClass.end_at)
                setEndAt(cClass.end_at.split(' ')[0])
        } else {
            setName('')
            setStartAt('')
            setEndAt('')
        }
    },[cClass])

    function getData(): dataType {
        let data = {} as dataType
        
        if(!cClass)
            data.pack_id = pack?.id

        if(endAt.length>0)
            data.end_at = endAt

        data.name = name
        data.start_at = startAt

        return data
    }

    function save(e: React.FormEvent) {
        e.preventDefault()
        setIsLoading(true)
        if(cClass)
            update()
        else
            saveNew()
    }

    function saveNew() {
        let data = getData()
        api.post('/classes',data)
        .then(
            response => {
                handleSave&& handleSave(response.data)
                handleClose&& handleClose()
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
        api.put('/classes/'+cClass?.id,data)
        .then(
            response => {
                handleUpdate&& handleUpdate(response.data)
                handleClose&& handleClose()
            }
        )
        .finally(
            () => setIsLoading(false)
        )
        .catch(
            error => {
                setError(error.response.data)
                setHasError(true)
            }
        )
    }

    function closeError() {
        setHasError(false)
    }

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header>
                <Modal.Title>{cClass? 'Editar turma' : 'Nova turma'}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={save}>
                <Modal.Body className='position-relative'>
                    <ErrorScreen show={hasError} handleClose={closeError} error={error}/>                    
                    <LoadingContainer show={isLoading}/>
                    <Form.Group className='mb-2'>
                        <h6>{pack?.name}</h6>
                    </Form.Group>
                    <Form.Group className='mb-2'>
                        <Form.Control 
                            type='text'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            min={4}
                            placeholder='Nome'
                            required/>
                    </Form.Group>
                    <Form.Group className='mb-2'>
                        <Form.Control 
                            type='date'
                            value={startAt}
                            onChange={(e) => setStartAt(e.target.value)}
                            required/>
                    </Form.Group>
                    <Form.Group className='mb-2'>
                        <Form.Control 
                            type='date'
                            value={endAt}
                            onChange={(e) => setEndAt(e.target.value)}/>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button 
                        variant='secondary'
                        onClick={handleClose}>Cancelar</Button>
                    <Button type='submit'>Salvar</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default ClassForm;