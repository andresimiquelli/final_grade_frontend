import React from 'react';
import DotLoader from 'react-spinners/DotLoader'
import { useTheme } from 'styled-components'
import { themeType } from '../../themes/theme_type';

import { Container } from './styles';

interface LoadingContainerProps {
    show?: boolean;
}

const LoadingContainer: React.FC<LoadingContainerProps> = ({ show }) => {

    const theme = useTheme() as themeType

    return (
        <Container show={show}>
            <DotLoader color={theme.colors.primary}/>
        </Container>
    );
}

export default LoadingContainer;