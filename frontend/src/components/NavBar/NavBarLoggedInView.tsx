import {User} from "../../models/user";
import * as AuthApi from "../../network/auth_api";
import {Button, Navbar} from "react-bootstrap";

interface NavBarLoggedInViewProps {
    user: User,
    onLogoutSuccessful: () => void,
}

const NavBarLoggedInView = ({user, onLogoutSuccessful}: NavBarLoggedInViewProps) => {
    async function logout() {
        try {
            await AuthApi.logout();
            onLogoutSuccessful();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
        <Navbar.Text className="me-2">
            Signed in as: {user.username}
            <Button onClick={logout}>Logout</Button>
        </Navbar.Text>
        </>
    );
}

export default NavBarLoggedInView;