import * as React from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import { useNavigate } from "react-router-dom";

export function DeleteProfileDialog() {
    let navigate = useNavigate();

    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleDeleteProfile = () => {
        // TODO: delete profile from database
        navigate("/")
    };

    return <>
        <Button variant="text" onClick={handleClickOpen}>
            Smazat profil
        </Button>
        <Dialog
            open={open}
            onClose={handleClose}
        >
            <DialogTitle id="delete-profile-title">
                {"Opravdu chcete smazat profil?"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="delete-profile-text">
                    Tuto akci nelze vrátit zpět. Přijdete tím o všechny uložené rezervace!
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} variant={"outlined"} autoFocus>Nemazat profil</Button>
                <Button onClick={handleDeleteProfile}>
                    Smazat profil
                </Button>
            </DialogActions>
        </Dialog>
    </>
}


