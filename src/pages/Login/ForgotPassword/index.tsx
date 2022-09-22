import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import LoadingContainer from '../../../components/LodingContainer';
import { useApi } from '../../../services/api';
import ErrorScreen from '../../../components/ErrorScreen';

interface ForgotPasswordProps {
    show?: boolean;
    onClose?(): void;
    onSuccess?(email: string): void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ show, onClose, onSuccess }) => {
    
    const api = useApi()

    const[email,setEmail] = useState('')
    const[isLoading,setIsLoading] = useState(false)
    const[message,setMessage] = useState<string | undefined>()

    function redefine(e: React.FormEvent) {
        e.preventDefault()
        setIsLoading(true)
        api.post('resetpassword', { email: email })
        .then(() => {
            onSuccess&& onSuccess(email)
            onClose&& onClose()
            setEmail('')
        })
        .catch(() => setMessage("Houve um erro ao tentar redefinir sua senha."))
        .finally(() => setIsLoading(false))
    }

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header>
                <Modal.Title>Redefinir senha</Modal.Title>
            </Modal.Header>
            <Form onSubmit={redefine}>
            <Modal.Body className='position-relative' style={{height: '180px'}}>
                <LoadingContainer show={isLoading} />
                <ErrorScreen                    
                    message={message}
                    show={message? true : false}
                    handleClose={() => setMessage(undefined)}/>
                <p>Informe o email de login para rederfinirmos sua senha:</p>                
                <Form.Group className='mt-3 mb-3'>
                    <Form.Control
                        type='email'
                        placeholder='E-mail de acesso ao sistema'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} 
                        required />
                </Form.Group>                
            </Modal.Body>
            <Modal.Footer>
                <Button variant='secondary' onClick={onClose}>Cancelar</Button>
                <Button variant='danger' type='submit'>Redefinir senha</Button>
            </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default ForgotPassword;