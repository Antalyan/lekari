import {useState} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import {Icon, Link} from "@mui/material";

import Logo from "../../images/logoREPLACE.png"
import AvatarImg from "../../images/mock_profile.jpg"
import {AccountCircle} from "@mui/icons-material";
import {LoginForm} from "./LoginForm";
import {userAtom} from "../../state/LoggedInAtom";
import {useRecoilState, useRecoilValue} from "recoil";

const pages = ['Products', 'Pricing', 'Blog'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

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
        {/* //TODO add: onClick={handleClose} */}
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
                <Link href={"/"} underline="hover">
                    <img src={Logo} alt="Logo" width="50" height="50"/>
                </Link>
                <Typography
                    sx={{m: 2, flexGrow: 1}}
                    variant="h6"
                    color="white"
                >
                    Luďkovi<br/>Lékaři
                </Typography>
                <Typography
                    sx={{m: 1}}
                    variant="h6"
                    align="right"
                >{user.id != null ? user.name : "Nepřihlášený"}</Typography>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                >
                    {user.id ? <Avatar alt={user.name} src={AvatarImg} sx={{width: 60, height: 60}}/> :
                        <AccountCircle fontSize="large"/>}
                </IconButton>
                <LoginMenu anchorEl={anchorEl} onClose={handleClose}/>
            </Toolbar>
        </AppBar>
    );
};
