import * as React from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import {IDialogProps} from "../utils/Interfaces";

export function OpenInformationDialog({name, text, title}: IDialogProps) {
    const [open, setOpen] = React.useState(true);
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    handleOpen()
    return <>
        <Dialog
            open={open}
            onClose={handleClose}
        >
            <DialogTitle id={name + "-title"}>
                {title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id={name + "-text"}>
                    {text}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} size={"small"} autoFocus>OK</Button>
            </DialogActions>
        </Dialog>
    </>
}


