import react from "react";
import styled from "styled-components";

interface WrapperProps {
    variant?: 'small' | 'regular' ,
    children: any,
}

const StyledWrapper = styled.div`
    max-width: ${props => props.variant === 'regular' ? '800px' : '400px'};
    width: 100%;
    margin-top: 2rem;
    margin-left: auto;
    margin-right: auto;
`;

const Wrapper: react.FC<WrapperProps> = ({children, variant="regular"}) => {
    return(
        <StyledWrapper variant={variant}>
            {children}
        </StyledWrapper>
    )
}

export default Wrapper;