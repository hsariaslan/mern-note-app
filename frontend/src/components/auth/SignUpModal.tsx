import {Alert, Button, Form, Modal} from "react-bootstrap";
import { User as UserModel } from "../../models/user";
import {useForm} from "react-hook-form";
import * as AuthApi from "../../network/auth_api";
import TextInputField from "../form/TextInputField";
import {useState} from "react";
import {BadRequestError, ConflictError, UnauthorizedError} from "../../errors/http_errors";

interface SignUpModalProps {
    onDismiss: () => void,
    onSignUpSuccessful: (user: UserModel) => void,
}

const SignUpModal = ({onDismiss, onSignUpSuccessful}: SignUpModalProps) => {
    const [errorText, setErrorText] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isSubmitting
    }} = useForm<AuthApi.SignUpCredentials>();

    async function onSubmit(credentials: AuthApi.SignUpCredentials): Promise<void> {
        try {
            const newUser: UserModel = await AuthApi.signUp(credentials);
            onSignUpSuccessful(newUser);
        } catch (error) {
            if (error instanceof BadRequestError || error instanceof UnauthorizedError || error instanceof ConflictError) {
                setErrorText(error.message);
            }
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
                {errorText &&
                    <Alert variant="danger">{errorText}</Alert>
                }
                <Form id="signUpForm" onSubmit={handleSubmit(onSubmit)}>
                    <TextInputField
                        name="username"
                        label="Username"
                        register={register}
                        registerOptions={{required: "Required"}}
                        error={errors.username}
                        type="text"
                    />
                    <TextInputField
                        name="email"
                        label="Email"
                        register={register}
                        registerOptions={{required: "Required"}}
                        error={errors.email}
                        type="email"
                    />
                    <TextInputField
                        name="password"
                        label="Password"
                        register={register}
                        registerOptions={{required: "Required"}}
                        error={errors.password}
                        type="password"
                    />
                    <TextInputField
                        name="confirm_password"
                        label="Confirm Password"
                        register={register}
                        registerOptions={{required: "Required"}}
                        error={errors.confirm_password}
                        type="password"
                    />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button type="submit" form="signUpForm" disabled={isSubmitting}>
                    Sign Up
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default SignUpModal;