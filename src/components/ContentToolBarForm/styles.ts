import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    align-items: center;
    > * {
        margin-right: 5px;

        &:last-child {
            margin-right: 0;
        }
    }
`;