import styled from 'styled-components';

interface ContainerProps {
    selectionMode?: boolean
}

export const Container = styled.table<ContainerProps>`
    width: 100%;

    > thead {

        > tr > th {
            text-transform: uppercase;
            font-weight: 400;
            padding: 1rem;
            color: ${props => props.theme.colors.gray_70};
            font-size: .8rem;
            border-bottom: 1px solid ${props => props.theme.colors.gray_10};

            &:first-child {
                padding-left: 2rem;
            }
        }

        
    }

    tbody > tr {

        cursor: ${props => props.selectionMode? 'pointer' : 'inherit'};

        > td {
            border-collapse: collapse;
            border-bottom: 1px solid ${props => props.theme.colors.gray_10};
            padding: 1rem;
            font-size: .9rem;

            &:first-child {
                padding-left: 2rem;
            }
        }

        &:hover {
            background-color: ${props => props.theme.colors.gray_5};
        }
    } 
`;