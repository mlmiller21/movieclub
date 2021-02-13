import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
    //Put global stuff in here (use sass)
`;

const GlobalLayout = ({children}: {children: any}) => {
    return(
        <>
            <GlobalStyle/>
            {children}
        </>
    )
}