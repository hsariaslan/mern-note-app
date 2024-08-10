import React, {useEffect} from 'react';
import {Container} from "react-bootstrap";
import NavBar from "./components/NavBar/NavBar";
import {User} from "./models/user";
import * as AuthApi from "./network/auth_api";
import SignUpModal from "./components/auth/SignUpModal";
import LoginModal from "./components/auth/LoginModal";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import NotesPage from "./pages/NotesPage";
import PrivacyPage from "./pages/PrivacyPage";
import NotFoundPage from "./pages/NotFoundPage";

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
                // console.log(error);
            }
        }

        fetchLoggedInUser();
    }, []);

    return (
        <BrowserRouter basename={process.env.REACT_APP_BASE_URL}>
            <NavBar
                loggedInUser={loggedInUser}
                onSignUpClicked={() => setSignUpModalOpen(true)}
                onLoginClicked={() => setLoginModalOpen(true)}
                onLogoutSuccessful={() => setLoggedInUser(null)}
            />

            <Container>
                <Routes>
                    <Route path="/" element={<NotesPage loggedInUser={loggedInUser} />} />
                    <Route path="/privacy" element={<PrivacyPage />} />
                    <Route path="/*" element={<NotFoundPage />} />
                </Routes>
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
        </BrowserRouter>
    );
}

export default App;
