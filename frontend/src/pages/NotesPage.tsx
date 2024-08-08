import NotesPageLoggedInView from "../components/NotesPageLoggedInView";
import NotesPageLoggedOutView from "../components/NotesPageLoggedOutView";
import {Container} from "react-bootstrap";
import React from "react";
import {User} from "../models/user";

interface NotesPageProps {
    loggedInUser: User | null
}

const NotesPage = ({loggedInUser}: NotesPageProps) => {
    return (
        <Container className="d-flex flex-column align-items-center">
            <>
                {loggedInUser
                    ? <NotesPageLoggedInView/>
                    : <NotesPageLoggedOutView/>}
            </>
        </Container>
    );
}

export default NotesPage;