import React from 'react';
import { Alert } from 'react-bootstrap';

import { Container, MessageWrapper } from './styles';

export type MessageType = {
    title?: string;
    content: string;
    variant: "primary" | "success" | "danger" | "warning" | "info";
}

interface ContextMessagerProps {
    messages: MessageType[];
    onClose(index: number): void;
}

const ContextMessager: React.FC<ContextMessagerProps> = ({ messages, onClose }) => {


    return (
        <Container>
            <MessageWrapper>
            {
                messages.map((message, index) => 
                    <Alert variant={message.variant} dismissible key={index} onClose={() => onClose(index)}>
                        {message.title&& <Alert.Heading>{message.title}</Alert.Heading>}
                        <p>{message.content}</p>
                    </Alert>
                    )
            }
            
            </MessageWrapper>
        </Container>
    );
}

export default ContextMessager;