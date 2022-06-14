import * as React from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import {useNavigate} from "react-router-dom";
import Grid from "@mui/material/Grid";
import axios from "axios";
import {useRecoilState} from "recoil";
import {userAtom} from "../../state/LoggedInAtom";
import {checkStatusOK} from "../../utils/fetcher";

export function DeleteProfileDialog() {
    let navigate = useNavigate();
    const [user, setUser] = useRecoilState(userAtom);

    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const handleDeleteProfile = async () => {
        const url = 'http://localhost:4000/' + (user.isDoctor == true ? 'doctor-info' : 'personal-info');
        await axios.delete(url, {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }})
            .then(response => {
                if (checkStatusOK(response.status)) {
                    console.log("Deletion succeeded");
                    setUser({});
                    navigate("/");
                }
            })
            .catch(error => {
                console.error(error);
                alert("Mazání profilu selhalo!\n\n" + error.response.data.message)
            });
    }

    return <>
        <Grid>
            <Button variant="text" onClick={handleClickOpen}>
                Smazat profil
            </Button>
        </Grid>
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


