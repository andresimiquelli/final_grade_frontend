import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import subjectType from '../../../services/apiTypes/Subject';
import { useAuth } from '../../../context/auth';
import { useApi } from '../../../services/api';
import LoadingContainer from '../../../components/LodingContainer';

interface SubjectFormProps {
    show?: boolean;
    subject?: subjectType;
    handleClose?(): void;
    handleSave?(subject: subjectType): void;
    handleUpdate?(subject: subjectType): void;
}

interface dataType {
    name: string;
    description?: string;
}

const SubjectForm: React.FC<SubjectFormProps> = ({ show, subject, handleClose, handleSave, handleUpdate }) => {

    const { token } = useAuth()
    const api = useApi(token)

    const[name,setName] = useState('')
    const[description,setDescription] = useState('')

    const[isLoading,setIsLoading] = useState(false)

    useEffect(() => {
        if(subject) {
            setName(subject.name)
            setDescription(subject.description)
        }
    },[subject])

    function close() {
        clear()
        handleClose&& handleClose()
    }

    function clear() {
        setName('')
        setDescription('')
    }

    function getData(): dataType {
        let data = { name: name } as dataType
        if(description.trim().length > 0)
            data.description = description
            
        return data;
    }

    function save(e: React.FormEvent) {
        e.preventDefault()
        setIsLoading(true)
        if(subject)
            update()
        else
            saveNew()
    }

    function saveNew() {
        let data = getData()

        api.post('/subjects',data)
        .then(
            response => {
                handleSave&& handleSave(response.data)
                close()
            }
        )
        .finally(
            () => setIsLoading(false)
        )
    }

    function update() {
        let data = getData()

        api.put('/subjects/'+subject?.id,data)
        .then(
            response => {
                handleUpdate&& handleUpdate(response.data)
                close()
            }
        )
        .finally(
            () => setIsLoading(false)
        )
    }

    return (
        <Modal show={show}>
            <Modal.Header>
                <Modal.Title>
                    { subject? 'Editar disciplina' : 'Nova disciplina' }
                </Modal.Title>
            </Modal.Header>            
            <Form onSubmit={save}>
                <Modal.Body className='position-relative'>
                    <LoadingContainer show={isLoading}/>
                    <Form.Group className="mb-2">
                        <Form.Control 
                            type="text" 
                            placeholder='Nome'
                            required 
                            minLength={5}
                            maxLength={191}
                            onChange={(e) => setName(e.target.value)}
                            value={name}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Text>
                            <Form.Control 
                                as='textarea'
                                placeholder='Descrição'
                                maxLength={256}
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}/>
                        </Form.Text>
                    </Form.Group>
                </Modal.Body>          
                <Modal.Footer>
                    <Button variant="secondary" onClick={close}>
                        Cancelar
                    </Button>
                    <Button type='submit' variant="primary">
                        Salvar
                    </Button>
                </Modal.Footer>
            </Form>  
        </Modal>
    );
}

export default SubjectForm;