import React from 'react';
import BarLoader from 'react-spinners/BarLoader'

import { Container } from './styles';

const LoadingContainer: React.FC = () => {
    return (
        <Container>
            <BarLoader color='#CCC' width={'100%'}/>
        </Container>
    );
}

export default LoadingContainer;