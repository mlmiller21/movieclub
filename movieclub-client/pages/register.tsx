import react from 'react'
import Wrapper from "../components/Wrapper";
import RegisterState from "../context/register/RegisterState"
import RegisterForm from "../components/RegisterForm";

interface RegisterProps {

}

const Register: react.FC<RegisterProps> = ({}) => {

    return (
        <RegisterState>
            <Wrapper variant='small'>
                <RegisterForm/>
            </Wrapper>
        </RegisterState>
    );
}

export default Register;