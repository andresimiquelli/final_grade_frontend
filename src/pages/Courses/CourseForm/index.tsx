import React, { useEffect, useState } from 'react';
import { Button, Form, FormControl, Modal } from 'react-bootstrap';
import courseType, { CourseLevels } from '../../../services/apiTypes/Course';
import { useAuth } from '../../../context/auth'
import { useApi } from '../../../services/api'
import LoadingContainer from '../../../components/LodingContainer';

interface CourseFormProps {
    show?: boolean;
    course?: courseType;
    handleClose?(): void;
    handleSave?(course: courseType): void;
    handleUpdate?(course: courseType): void;
}

interface dataType {
    name: string;
    level: number;
}

const CourseForm: React.FC<CourseFormProps> = ({ show, course, handleSave, handleClose, handleUpdate }) => {

    const { token } = useAuth()
    const api = useApi(token)

    const[name,setName] = useState('')
    const[level,setLevel] = useState(CourseLevels.TEC.value)

    const[isLoading,setIsLoading] = useState(false)

    useEffect(() => {
        if(course) {
            setName(course.name)
            setLevel(course.level)
        } else {
            clear()
        }
    },[course])

    function close() {
        clear()
        handleClose&& handleClose()
    }

    function clear() {
        setName('')
        setLevel(CourseLevels.TEC.value)
    }

    function getData(): dataType {
        return {
            name: name,
            level: level
        }
    }

    function save(e: React.FormEvent) {
        e.preventDefault()
        setIsLoading(true)
        if(course)
            update()
        else
            saveNew()
    }

    function saveNew() {
        let data = getData()
        api.post('/courses',data)
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
        api.put('/courses/'+course?.id, data)
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
        <Modal show={show} onHide={close}>
            <Modal.Header>
                <Modal.Title>{ course? 'Editar curso' : 'Novo curso'}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={save}>
                <Modal.Body className='position-relative'>
                    <LoadingContainer show={isLoading}/>
                    <Form.Group className='mb-2'>
                        <Form.Control
                            type="text"
                            value={name}
                            minLength={5}
                            maxLength={191}
                            required
                            onChange={(e) => setName(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className='mb-2'>
                        <Form.Select value={level} onChange={(e) => setLevel(parseInt(e.target.value))}>
                            <option value={CourseLevels.TEC.value}>{CourseLevels.TEC.label}</option>
                            <option value={CourseLevels.LIVRE.value}>{CourseLevels.LIVRE.label}</option>
                            <option value={CourseLevels.POSLAT.value}>{CourseLevels.POSLAT.label}</option>
                            <option value={CourseLevels.POSSTRICT.value}>{CourseLevels.POSSTRICT.label}</option>
                            <option value={CourseLevels.SUP.value}>{CourseLevels.SUP.label}</option>
                            <option value={CourseLevels.REG.value}>{CourseLevels.REG.label}</option>
                        </Form.Select>
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

export default CourseForm;