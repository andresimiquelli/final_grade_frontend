import React from 'react';
import { Button, Modal } from 'react-bootstrap';

interface ConfirmationModalProps {
    show: boolean;
    title?: string;
    subtitle?: string;
    text?: string;
    children?: React.ReactNode;
    confirmButtonText?: string;
    cancelButtonText?: string;
    onConfirm?(): void;
    onCancel?(): void;
    onClose?(): void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ( props ) => {
    return (
        <Modal show={props.show} onHide={props.onClose}>
            <Modal.Header>
                <Modal.Title>{props.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {props.subtitle&& <h4>{props.subtitle}</h4>}
                {props.text&& <small>{props.text}</small> }                
                {props.children}
            </Modal.Body>
            <Modal.Footer>
                <Button 
                    variant='secondary'
                    onClick={props.onCancel}>
                    {props.cancelButtonText? props.cancelButtonText : 'Cancelar'}
                </Button>
                <Button 
                    variant='danger'
                    onClick={props.onConfirm}>
                        {props.confirmButtonText? props.confirmButtonText : 'Confirmar'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ConfirmationModal;