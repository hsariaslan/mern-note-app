import {Button, Form, Modal} from "react-bootstrap";
import { User as UserModel } from "../../models/user";
import {useForm} from "react-hook-form";
import * as AuthApi from "../../network/auth_api";
import TextInputField from "../form/TextInputField";

interface LoginModalProps {
    onDismiss: () => void,
    onLoginSuccessful: (user: UserModel) => void,
}

const LoginModal = ({onDismiss, onLoginSuccessful}: LoginModalProps) => {
    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isSubmitting
    }} = useForm<AuthApi.LoginCredentials>();

    async function onSubmit(credentials: AuthApi.LoginCredentials): Promise<void> {
        try {
            const loggedInUser: UserModel = await AuthApi.login(credentials);
            onLoginSuccessful(loggedInUser);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Modal show onHide={onDismiss}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Sign Up
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form id="loginForm" onSubmit={handleSubmit(onSubmit)}>
                    <TextInputField
                        name="username"
                        label="Username"
                        register={register}
                        registerOptions={{required: "Required"}}
                        error={errors.username}
                        type="text"
                    />
                    <TextInputField
                        name="password"
                        label="Password"
                        register={register}
                        registerOptions={{required: "Required"}}
                        error={errors.password}
                        type="password"
                    />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button type="submit" form="loginForm" disabled={isSubmitting}>
                    Login
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default LoginModal;