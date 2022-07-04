import styled from 'styled-components';

export const TagType = styled.div`
    width: 100%;
    padding: .4rem;
    border: 1px solid ${props => props.theme.colors.gray_50};
    border-radius: 5px;
    font-weight: bold;
    font-size: .7rem;
    color: ${props => props.theme.colors.gray_50};
    text-align: center;
`;