import * as React from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import {IReservation} from "../../utils/Interfaces";
import axios from "axios";

export function DeleteReservationDialog(props: { isPatient: boolean, reservation: IReservation }) {
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const handleDeleteReservation = async () => {
        // TODO: delete reservation from database AND update GUI (perhaps automatically using SWR?)
        // setOpen(false);
        // const url = 'http://localhost:4000/' + (user.isDoctor == true ? 'doctor-info' : 'personal-info');
        // console.log(url);
        // await axios.delete(url, {
        //     headers: {
        //         'Authorization': `Bearer ${user.token}`
        //     }})
        //     .then(response => {
        //         console.log("Deletion succeeded");
        //         setUser({});
        //         navigate("/");
        //     })
        //     .catch(error => {
        //         console.error(error);
        //         alert("Mazání profilu selhalo!\n\n" + error.response.data.message)
        //     });
    };

    return <>
        <Button variant='contained' color={'primary'}
                size={"large"}
                onClick={handleClickOpen}>ZRUŠIT
        </Button>
        <Dialog
            open={open}
            onClose={handleClose}
        >
            <DialogTitle id="delete-reservation-title">
                Smazat rezervaci
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="delete-reservation-text">
                    Chcete skutečně smazat tuto rezervaci?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} size={"small"} autoFocus>Nemazat rezervaci</Button>
                <Button onClick={handleDeleteReservation} size={"small"}>
                    Smazat rezervaci
                </Button>
            </DialogActions>
        </Dialog>
    </>
}


