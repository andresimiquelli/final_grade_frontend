import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

import UserApi, { UserStatus, UserType } from '../../../services/apiTypes/User';
import { useApi } from  '../../../services/api'
import { useAuth } from '../../../context/auth'
import LoadingContainer from '../../../components/LodingContainer';

interface UserFormProps {
    show: boolean;
    user?: UserApi;
    handleClose(): void;
    handleSave?(user: UserApi): void;
    handleUpdate?(user: UserApi): void;
}

const UserForm: React.FC<UserFormProps> = ( props ) => {

    const { token } = useAuth()
    const api = useApi(token)

    const refForm = useRef<HTMLFormElement>(null)

    const[name,setName] = useState('')
    const[email,setEmail] = useState('')
    const[password,setPassword] = useState('')
    const[type,setType] = useState(UserType.ADMIN.value)
    const[status,setStatus] = useState(UserStatus.ACTIVE)

    const[loading,setLoading] = useState(false)

    useEffect(() => {
        if(props.user) {
           setName(props.user.name) 
           setEmail(props.user.email)
           setType(props.user.type)
        }        
    },[props.user])

    function save(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        if(props.user)
            update()
        else
            saveNew()
    }

    function saveNew() {
        const data = {
            name: name,
            email: email,
            password: password,
            type: type,
            status: status
        }

        api.post('/users', data)
        .then(
            response => {
                close()
                props.handleSave&& props.handleSave(response.data)
            }
        )
        .catch(
            error => console.log(error)
        )
        .finally(
            () => setLoading(false)
        )
    }

    function update() {
        const data = {
            name: name,
            type: type,
            status: status
        }

        api.put(`/users/${props.user?.id}`, data)
        .then(
            response => {
                close()
                props.handleUpdate&& props.handleUpdate(response.data)
            }
        )
        .catch(
            error => console.log(error)
        )
        .finally(
            () => setLoading(false)
        )
    }

    function clear() {
        setName('')
        setEmail('')
        setPassword('')
        setType(UserType.ADMIN.value)
    }

    function close() {
        clear()
        props.handleClose()
    }

    return (
        <Modal show={props.show} onHide={close}>
            <Modal.Header closeButton>
                <Modal.Title>
                {
                    props.user? 'Editar usuário' : 'Novo usuário'
                }
                </Modal.Title>
            </Modal.Header>
            <Form onSubmit={save} ref={refForm} >
                <Modal.Body className='position-relative'>
                    <LoadingContainer show={loading}/>                    
                        <Form.Group className="mb-2">
                            <Form.Control 
                                type="text" 
                                placeholder='Nome'
                                required 
                                minLength={5}
                                onChange={(e) => setName(e.target.value)}
                                value={name}/>
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Control 
                                disabled={props.user? true : false}
                                type="email"
                                placeholder='E-mail'
                                required
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                name="finalgrade_form_user_email"/>
                        </Form.Group>                    
                        <Form.Group className="mb-2">
                            <Form.Control 
                                disabled={props.user? true : false}
                                type="password" 
                                placeholder='Senha'
                                minLength={6}
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                name="finalgrade_form_user_password"/>
                        </Form.Group>                        
                        <Form.Group className="mb-2">
                            <Form.Select 
                                onChange={(e) => setType(parseInt(e.target.value))}
                                value={type}>
                                <option value={UserType.ADMIN.value}>{UserType.ADMIN.label}</option>
                                <option value={UserType.COORD.value}>{UserType.COORD.label}</option>
                                <option value={UserType.PROF.value}>{UserType.PROF.label}</option>
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

export default UserForm;