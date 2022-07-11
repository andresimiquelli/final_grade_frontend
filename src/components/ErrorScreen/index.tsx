import React, { useEffect } from 'react';
import { BiMessageAltError } from 'react-icons/bi'
import errorType from '../../services/apiTypes/Error';
import { getMessage } from '../../utils/errorHandler';

import { Container, Icon, ButtonClose } from './styles';

interface ErrorScreenProps {
    show?: boolean;
    handleClose?(): void;
    error?: errorType;
    message?: string;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ( props ) => {

    function handleOk(e: React.MouseEvent) {
        e.preventDefault()
        props.handleClose&& props.handleClose()
    }

    useEffect(() => {

    }, [props.error])

    return (
        <Container show={props.show}>
            <Icon>
                <BiMessageAltError />
            </Icon>
            <p>{ !props.message&& props.error&& getMessage(props.error?.type) }</p>
            <ButtonClose onClick={handleOk}>OK</ButtonClose>
        </Container>
    );
}

export default ErrorScreen;