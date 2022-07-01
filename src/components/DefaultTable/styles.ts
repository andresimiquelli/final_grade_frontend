import styled from 'styled-components';

export const Container = styled.table`
    width: 100%;

    > thead {

        > tr > th {
            text-transform: uppercase;
            font-weight: 400;
            padding: 1rem;
            color: ${props => props.theme.colors.gray_70};
            font-size: .8rem;
            border-bottom: 1px solid ${props => props.theme.colors.gray_10};
        }

        
    }

    tbody > tr {

        > td {
            border-collapse: collapse;
            border-bottom: 1px solid ${props => props.theme.colors.gray_10};
            padding: 1rem;
        }

        &:hover {
            background-color: ${props => props.theme.colors.gray_5};
        }
    } 
`;