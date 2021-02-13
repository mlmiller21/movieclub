import react from "react"
import styled from "styled-components"

interface WrapperProps {
    variant: 'small' | 'regular' | 'large',
    children: any,
}

const StyledWrapper = styled.div`
    
`;

const Wrapper: React.FC<WrapperProps> = ({children, variant="regular"}) => {
    return(
        <StyledWrapper variant={variant}>
            {children}
        </StyledWrapper>
    )
}

export default Wrapper;