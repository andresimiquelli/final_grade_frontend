import styled from 'styled-components';

export const Container = styled.div`
    width: 100%;
    padding: 1rem;

    display: flex;

    > div {
        flex: 1;
        display: flex;

        &:first-child {
            justify-content: flex-start;
        }

        &:last-child {
            justify-content: flex-end;
        }

        justify-content: center;
    }
`;