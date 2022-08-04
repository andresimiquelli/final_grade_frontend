import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import lessonType from '../../../services/apiTypes/Lesson';
import { useAuth } from '../../../context/auth';
import { useApi } from '../../../services/api';
import LoadingContainer from '../../../components/LodingContainer';


interface LessonFormProps {
    show?: boolean;
    lesson?: lessonType;
    handleClose?(): void;
    handleSave?(lesson: lessonType): void;
    handleUpdate?(lesson: lessonType): void;
    classId?: string;
    subjectId?: string;
}

type dataType = {
    content: string;
    reference: string;
}

const LessonForm: React.FC<LessonFormProps> = ( props ) => {

    const { token } = useAuth()
    const api = useApi(token)

    const[content,setContent] = useState('')
    const[reference,setReference] = useState('')
    const[isLoading,setIsLoading] = useState(false)

    useEffect(() => {
        if(props.lesson) {
            setContent(props.lesson.content)
            setReference(props.lesson.reference)
        } else {
            clearForm()
        }
    },[props.lesson])

    function clearForm() {
        setContent('')
        setReference('')
    }

    function getData(): dataType {
        return {
            content: content,
            reference: reference
        }
    }  

    function save(e: React.FormEvent) {
        e.preventDefault()
        setIsLoading(true)
        
        if(props.lesson)
            update()
        else
            saveNew()
    }

    function saveNew() {
        const data = getData()
        api.post(`/class/${props.classId}/subject/${props.subjectId}/lessons`,data)
        .then(
            response => {
                props.handleSave&& props.handleSave(response.data)
                props.handleClose&& props.handleClose()
            }
        )
        .finally(() => setIsLoading(false))
    }

    function update() {
        const data = getData()
        api.put(`/class/${props.classId}/subject/${props.subjectId}/lessons/${props.lesson?.id}`,data)
        .then(
            response => {
                props.handleUpdate&& props.handleUpdate(response.data)
                props.handleClose&& props.handleClose()
            }
        )
        .finally(() => setIsLoading(false))
    }

    return (
        <Modal show={props.show} onHide={props.handleClose}>
            <Modal.Header>
                <Modal.Title>
                    { props.lesson? 'Editar aula' : 'Nova aula' }
                </Modal.Title>
            </Modal.Header>
            <Form onSubmit={save}>
                <Modal.Body className='position-relative'>
                    <LoadingContainer show={isLoading} />
                    <Form.Group className='mb-2'>
                        <Form.Control 
                            type='date'
                            value={reference}
                            onChange={(e) => setReference(e.target.value)} 
                            required />
                    </Form.Group>
                    <Form.Group className='mb-2'>
                        <Form.Control 
                            as='textarea'
                            maxLength={512}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                            placeholder='Conteúdo da aula'/>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button 
                        variant='secondary'
                        onClick={props.handleClose}>
                        Cancelar
                    </Button>
                    <Button type='submit'>
                        Salvar
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default LessonForm;