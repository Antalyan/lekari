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
import {AccountCircle} from "@mui/icons-material";
import {LoginForm} from "./LoginForm";

const pages = ['Products', 'Pricing', 'Blog'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];
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

    return (
        <AppBar position="static">
            <Toolbar>
                <img src={Logo} alt="Logo" width="50" height="50"/>
                <Typography
                    sx={{m: 2, flexGrow: 1}}
                    variant="h6"
                >Luďkovi<br/>Lékaři
                </Typography>
                <Typography
                    sx={{m: 1}}
                    variant="h6"
                >Nepřihlášený</Typography>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                >
                    <AccountCircle fontSize="large"/>
                </IconButton>
                <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    {/* //TODO add: onClick={handleClose} */}
                    <LoginForm/>
                    <MenuItem>
                        <Link href={"/register-patient"} underline="hover">
                            {'Registrovat se - pacient'}
                        </Link>
                    </MenuItem>
                    <MenuItem>
                        <Link href={"/register-doctor"} underline="hover">
                            {'Registrovat se - lékař'}
                        </Link>
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};
