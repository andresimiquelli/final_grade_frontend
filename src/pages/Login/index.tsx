import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import LoadingContainer from '../../components/LodingContainer';
import { useApi } from '../../services/api';
import { useAuth } from '../../context/auth';

import { BoxLogin, Container, Logo } from './styles';

import logo from '../../assets/logo_moria.png';


const Login: React.FC = () => {

    const api = useApi()
    const { setAuth } = useAuth()

    const[email,setEmail] = useState('')
    const[password,setPassword] = useState('')
    const[isLoading,setIsloading] = useState(false)

    function login(e: React.FormEvent) {
        e.preventDefault()
        setIsloading(true)

        let data = new FormData()
        data.append('email',email)
        data.append('password',password)

        api.post('/auth/login',data)
        .then(
            response => {
                setAuth(response.data)
            }
        )
        .catch()
        .finally(
            () => setIsloading(false)
        )
    }

    return (
        <Container>
            <BoxLogin>
                <LoadingContainer show={isLoading}/>
                <Logo>
                   <img src={logo} alt="" /> 
                </Logo>
                <Form className='p-4' onSubmit={login}>
                    <Form.Group className='mb-2'>
                        <Form.Control
                            type='email'
                            required 
                            placeholder='E-mail'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className='mb-2'>
                        <Form.Control
                            type='password'
                            required 
                            placeholder='Senha'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className='d-flex flex-row justify-content-center pt-2'>
                        <Button type='submit' size='lg'>Entrar</Button>
                    </Form.Group>
                    <Form.Group className='mt-4 d-flex flex-row justify-content-center'>
                        <Link to='/forgot-password'>Esqueci a senha</Link>
                    </Form.Group>
                </Form>                
            </BoxLogin>
        </Container>
    );
}

export default Login;