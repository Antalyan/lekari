import * as React from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";

// TODO: change whole file to become a unified information dialog,
//  states might need to be copied to components because of trigger issues (cannot be on button)

export function InformationDialog(props: { name: string, title?: string, text: string }) {
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return <>
        <Button variant='contained' color={'primary'}
                size={"medium"}
                onClick={handleClickOpen}>ZRUŠIT
        </Button>
        <Dialog
            open={open}
            onClose={handleClose}
        >
            <DialogTitle id={props.name + "-title"}>
                {props.title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id={props.name + "-text"}>
                    {props.text}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} size={"small"} autoFocus>OK</Button>
            </DialogActions>
        </Dialog>
    </>
}


