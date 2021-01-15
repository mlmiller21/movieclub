import { User } from "src/entities/User";

interface UserNamePassword {
    username: string,
    password: string,
    email: string
}

interface Error {
    field: string,
    message: string
}

interface UserResponse {
    errors?: Error[],
    user?: User
}

let createUser: (userCreation: UserNamePassword) => UserResponse = function(userCreation: UserNamePassword): UserResponse {
    return {
        errors: [
            {
            field: "field",
            message: "message"
            }
        ]
    }
)