import React, {useEffect} from 'react';
import {Container} from "react-bootstrap";
import NavBar from "./components/NavBar/NavBar";
import {User} from "./models/user";
import * as AuthApi from "./network/auth_api";
import SignUpModal from "./components/auth/SignUpModal";
import LoginModal from "./components/auth/LoginModal";
import NotesPageLoggedInView from "./components/NotesPageLoggedInView";
import NotesPageLoggedOutView from "./components/NotesPageLoggedOutView";

function App() {
    const [loggedInUser, setLoggedInUser] = React.useState<User | null>(null);
    const [signUpModalOpen, setSignUpModalOpen] = React.useState(false);
    const [loginModalOpen, setLoginModalOpen] = React.useState(false);

    useEffect(() => {
        async function fetchLoggedInUser() {
            try {
                const user = await AuthApi.getAuthenticatedUser();
                setLoggedInUser(user);
            } catch (error) {
                console.log(error);
            }
        }

        fetchLoggedInUser();
    }, []);

    return (
        <div>
            <NavBar
                loggedInUser={loggedInUser}
                onSignUpClicked={() => setSignUpModalOpen(true)}
                onLoginClicked={() => setLoginModalOpen(true)}
                onLogoutSuccessful={() => setLoggedInUser(null)}
            />
            <Container className="d-flex flex-column align-items-center">
                <>
                    {loggedInUser
                        ? <NotesPageLoggedInView/>
                        : <NotesPageLoggedOutView/>}
                </>
            </Container>
            {signUpModalOpen &&
                <SignUpModal onDismiss={() => setSignUpModalOpen(false)}
                             onSignUpSuccessful={(user: User): void => {
                                 setLoggedInUser(user);
                                 setSignUpModalOpen(false);
                             }}/>
            }
            {loginModalOpen &&
                <LoginModal onDismiss={() => setLoginModalOpen(false)}
                            onLoginSuccessful={(user: User): void => {
                                setLoggedInUser(user);
                                setLoginModalOpen(false);
                            }}/>
            }
        </div>
    );
}

export default App;
