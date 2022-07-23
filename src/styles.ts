import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
    body {
        margin: 0;
        font-family: 'Poppins', sans-serif;
        width: 100%;
        height: 100vh;
    }

    * {
        box-sizing: border-box;
    }

    a {
        text-decoration: none;
        font-size: .9rem;
    }
`;