import React from 'react';
import BarLoader from 'react-spinners/BarLoader'
import { useTheme } from 'styled-components'
import { themeType } from '../../themes/theme_type';

import { Container } from './styles';

const LoadingContainer: React.FC = () => {

    const theme = useTheme() as themeType

    return (
        <Container>
            <BarLoader color={theme.colors.primary} width={'100%'}/>
        </Container>
    );
}

export default LoadingContainer;