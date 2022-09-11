import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import lessonType from '../../../services/apiTypes/Lesson';
import { useAuth } from '../../../context/auth';
import { useApi } from '../../../services/api';
import LoadingContainer from '../../../components/LodingContainer';
import errorType from '../../../services/apiTypes/Error';
import ErrorScreen from '../../../components/ErrorScreen';
import { extractError } from '../../../utils/errorHandler';


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
    user_id?: number;
    content: string;
    reference: string;
}

const LessonForm: React.FC<LessonFormProps> = ( props ) => {

    const { token, currentUser } = useAuth()
    const api = useApi(token)

    const[content,setContent] = useState('')
    const[reference,setReference] = useState('')
    const[isLoading,setIsLoading] = useState(false)

    const[hasError,setHasError] = useState(false)
    const[error,setError] = useState<errorType | undefined>()

    useEffect(() => {
        if(props.lesson) {
            setContent(props.lesson.content)
            setReference(props.lesson.reference.split(" ")[0])
        } else {
            clearForm()
        }
    },[props.lesson])

    function clearForm() {
        setContent('')
        setReference('')
    }

    function close() {
        clearForm()
        setHasError(false)
        props.handleClose&& props.handleClose()
    }

    function getData(): dataType {
        let data = {
            content: content,
            reference: reference
        } as dataType

        if(!props.lesson)
            if(currentUser)
                data.user_id = currentUser.id

        return data;
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
        api.post(`/classes/${props.classId}/subjects/${props.subjectId}/lessons`,data)
        .then(
            response => {
                props.handleSave&& props.handleSave(response.data)
                close()
            }
        )
        .finally(() => setIsLoading(false))
        .catch(
            error => {
                setError(extractError(error))
                setHasError(true)
            }
        )
    }

    function update() {
        const data = getData()
        api.put(`/classes/${props.classId}/subjects/${props.subjectId}/lessons/${props.lesson?.id}`,data)
        .then(
            response => {
                props.handleUpdate&& props.handleUpdate(response.data)
                close()
            }
        )
        .finally(() => setIsLoading(false))
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
                <Modal.Title>
                    { props.lesson? 'Editar aula' : 'Nova aula' }
                </Modal.Title>
            </Modal.Header>
            <Form onSubmit={save}>
                <Modal.Body className='position-relative'>
                    <LoadingContainer show={isLoading} />
                    <ErrorScreen show={hasError} handleClose={() => setHasError(false)} error={error}/> 
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
                        onClick={close}>
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