import {useState} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import {Link} from "@mui/material";
import Logo from "../images/main_logo.png"
import AvatarImg from "../images/mock_profile.jpg"
import {AccountCircle} from "@mui/icons-material";
import {LoginForm} from "./MainPage/LoginForm";
import {userAtom} from "../state/LoggedInAtom";
import {useRecoilState, useRecoilValue} from "recoil";

function LoginMenu(props: { anchorEl: HTMLElement | null, onClose: () => void }) {
    const [user, setUser] = useRecoilState(userAtom);
    return <Menu
        id="menu-appbar"
        anchorEl={props.anchorEl}
        anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
            vertical: "top",
            horizontal: "right",
        }}
        open={Boolean(props.anchorEl)}
        onClose={props.onClose}
    >
        {user.id ? <>
                <MenuItem>
                    <Link href={"/my-profile"} underline="hover">
                        {"Můj profil"}
                    </Link>
                </MenuItem>
                {user.isDoctor && <MenuItem>
                    <Link href={"/doctor/" + user.id} underline="hover">
                        {"Moje stránka lékaře"}
                    </Link>
                </MenuItem>}
                <MenuItem>
                    <Link href={"/my-reservations"} underline="hover">
                        {"Moje rezervace"}
                    </Link>
                </MenuItem>
                {user.isDoctor && <MenuItem>
                    <Link href={"/patient-reservations"} underline="hover">
                        {"Rezervace pacientů"}
                    </Link>
                </MenuItem>}
                <MenuItem>
                    {/*Logout*/}
                    <Link
                        component="button"
                        variant="body1"
                        underline="hover"
                        onClick={() => setUser({})}>
                        Odhlásit se
                    </Link>
                </MenuItem>
            </>
            : <>
                <LoginForm/>
                <MenuItem>
                    <Link href={"/register-patient"} underline="hover">
                        {"Registrovat se - pacient"}
                    </Link>
                </MenuItem>
                <MenuItem>
                    <Link href={"/register-doctor"} underline="hover">
                        {"Registrovat se - lékař"}
                    </Link>
                </MenuItem>
            </>}
    </Menu>;
}

export default function Header() {
    const [auth, setAuth] = useState(true);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAuth(event.target.checked);
    };

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };


    const user = useRecoilValue(userAtom);

    return (
        <AppBar position="static">

            <Toolbar>
                <Box sx={{flexGrow: 1, display: "flex"}} marginRight={"auto"} marginLeft={"auto"} maxWidth={960}>
                    <Link href={"/"} underline="hover" marginTop={2}>
                        <img src={Logo} alt="Logo" width="50" height="57"/>
                    </Link>
                    <Typography
                        sx={{flexGrow: 1}}
                        variant="h6"
                        color="white"
                        margin={2}
                    >
                        Luďkovi<br/>Lékaři
                    </Typography>
                    <Typography
                        variant="h6"
                        align="right"
                        display={"block"}
                        marginTop={user.id != null ? 2 : 4}
                    >{user.id != null ? user.firstName: "Nepřihlášený"}<br/>{user.surname}</Typography>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="inherit"
                    >
                        {user.id ? <Avatar alt={"user avatar"} src={AvatarImg} sx={{width: 60, height: 60}}/> :
                            <AccountCircle fontSize="large"/>}
                    </IconButton>
                    <LoginMenu anchorEl={anchorEl} onClose={handleClose}/>
                </Box>
            </Toolbar>
        </AppBar>
    );
};
