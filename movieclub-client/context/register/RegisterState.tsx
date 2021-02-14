import react, {useReducer} from "react";
import { RegisterContext } from "./RegisterContext";
import { RegisterReducer } from "./RegisterReducer";
import { SET_ERROR, SET_LOADING, CLEAR_ERROR } from "../../actionTypes"
import axios from "axios";


interface RegisterStateProps {
    children: any
}

interface RegisterForm {
    username: string,
    email: string,
    password: string
}


const RegisterState: React.FC<RegisterStateProps> = ({children}: {children: any}) => {
    const initialState = {
        loading: false,
        errors: {}
    }

    const [state, dispatch] = useReducer(RegisterReducer, initialState)

    const createUser = async (registerForm: RegisterForm) => {
        setLoading();
        await axios.post('http://localhost:3080/api/v1/register', {
            username: registerForm.username,
            email: registerForm.email,
            password: registerForm.password
        },
        {withCredentials: true})
    }

    const setLoading = () => {
        dispatch({type: SET_LOADING});

    }

    const setErrors = (errors: object) => {
        dispatch({type: SET_ERROR, payload: errors});
    }

    return(
        <RegisterContext.Provider
            value={{
                errors: state.errors,
                loading: state.loading,
                createUser,
                setErrors
            }}
        >
            {children}
        </RegisterContext.Provider>
    )
}

export default RegisterState;