import styled from 'styled-components';

export const CardWrapper = styled.div`
    width: 100%;
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: .5rem 2rem 2rem 2rem;
`;

export const Card = styled.div`
    padding: 1.5rem 1.5rem 0 1.5rem;
    border: 2px solid ${props => props.theme.colors.gray_10};
    border-radius: 7px;
    width: 32%;
    margin-top: 1.5rem;

    > .anchor-area {

        > h3.card-title {
            font-size: 1.2rem;
            font-weight: bold;
        }

        > h4.card-subtitle {
            font-size: .95rem;
        }
    }
`;