import react, {InputHTMLAttributes } from "react";
import styled from "styled-components";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    type: 'text' | 'email' | 'password',
    label: string,
    placeholder: string
}

const StyledInput = styled.div`
    
`;

const InputField: react.FC<InputFieldProps> = (props) => {
    return(
        <StyledInput>
            <label htmlFor={props.name}>
                {props.label}
            </label>
            <br/>
            <input type={props.type} name={props.name} placeholder={props.placeholder} onChange={props.onChange}/>
        </StyledInput>
    )
}

export default InputField;