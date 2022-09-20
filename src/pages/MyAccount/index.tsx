import React, {useState} from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import ContentToolBar from '../../components/ContentToolBar';
import { useAuth } from '../../context/auth';
import { useApi } from '../../services/api';
import { useNav } from '../../context/nav';
import LoadingContainer from '../../components/LodingContainer';


const MyAccount: React.FC = () => {

    const { currentUser, token, updateUser } = useAuth()
    const api = useApi(token)
    const { addErrorMessage, addSuccesMessage } = useNav()

    const[name, setName] = useState(currentUser?.name)
    const[password, setPassword] = useState('')
    const[passwordConfirm, setPasswordConfirm] = useState('')
    const[currentPassword, setCurrentPassword] = useState('')

    const[isLoading, setIsLoading] = useState(false)

    function saveName(e: React.FormEvent) {
        e.preventDefault()
        setIsLoading(true)
        const data = { name: name }
        api.put(`/users/${currentUser?.id}`, data)
        .then(
            response => {
                updateUser(response.data)
                addSuccesMessage("Nome atualizado com sucesso!")
            }
        )
        .catch(error => addErrorMessage(error))
        .finally(() =>setIsLoading(false))
    }

    function changePassword(e: React.FormEvent) {
        e.preventDefault()
        setIsLoading(true)
        const data = {
            password: password,
            passwordConfirm: passwordConfirm,
            currentPassword: currentPassword
        }
        api.patch(`/users/${currentUser?.id}/change_password`, data)
        .then( () => addSuccesMessage("Senha alterada com sucesso!"))
        .catch(error => addErrorMessage(error))
        .finally(() =>setIsLoading(false))
    }

    return (
        <Container className='position-relative' fluid>
            <LoadingContainer show={isLoading} />
            <ContentToolBar>
                <div></div>
            </ContentToolBar>
            <Row>
                <Col className='p-3' sm={12} md={6} lg={5} xl={4}>
                    <h4>Informações pessoais</h4>
                    <Form onSubmit={saveName}>
                        <Form.Group className='mb-3'>
                            <Form.Control
                                required
                                type='text' 
                                placeholder='Nome'
                                value={name}
                                onChange={(e) => setName(e.target.value)}/>
                        </Form.Group>
                        <Form.Group className='mb-3'>
                            <Form.Control 
                                disabled
                                type='email' 
                                placeholder='E-mail'
                                value={currentUser?.email}/>
                        </Form.Group>
                        <Form.Group>
                            <Button type='submit'>Salvar alterações</Button>
                        </Form.Group>
                    </Form>
                </Col>
                <Col className='p-3' sm={12} md={6} lg={5} xl={4}>
                    <h4>Alteração de senha</h4>
                    <Form onSubmit={changePassword}>
                        <Form.Group className='mb-3'>
                            <Form.Control 
                                required
                                type='password' 
                                placeholder='Senha atual'
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}/>
                        </Form.Group>
                        <Form.Group className='mb-3'>
                            <Form.Control 
                                required
                                type='password' 
                                placeholder='Nova senha'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}/>
                        </Form.Group>
                        <Form.Group className='mb-3'>
                            <Form.Control 
                                required
                                type='password' 
                                placeholder='Repita a senha'
                                value={passwordConfirm}
                                onChange={(e) => setPasswordConfirm(e.target.value)}/>
                        </Form.Group>
                        <Form.Group>
                            <Button type='submit'>Alterar senha</Button>
                        </Form.Group>
                    </Form>
                    <Col className='p-3' sm={12} lg={2} xl={4}></Col>
                </Col>
            </Row>
        </Container>
    );
}

export default MyAccount;