import * as React from "react";
import Grid from "@mui/material/Grid";
import {IconButton, Stack, TextareaAutosize, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import EditIcon from '@mui/icons-material/Edit';
import {IBasicDoctor, IContact, IPatient} from "../Interfaces";
import Typography from "@mui/material/Typography";
import {LocationOn, Person, Warning} from "@mui/icons-material";
import Box from "@mui/material/Box";
import Profile from "../../images/mock_profile.jpg";
import {useState} from "react";
import {FormContainer, MultiSelectElement, SelectElement, TextFieldElement} from "react-hook-form-mui";
import {useForm} from "react-hook-form";
import {languages} from "../../data/MockData";

const days = ["Po", "Út", "St", "Čt", "Pá", "So", "Ne"]

function Opening(editable: boolean) {
    const [editingState, setEditingState] = useState(false);
    return (<>
            <Box>
                <Typography
                    variant="subtitle1"
                    color={"primary.main"}
                    display="inline"
                > Otevírací doba
                </Typography>
                {editable && <IconButton onClick={() => setEditingState(!editingState)}
                                         type={!editingState ? "submit" : undefined}>
                    <EditIcon/>
                </IconButton>}
            </Box>
            <Stack spacing={editingState ? 2 : 0}>
                {days.map((day, index) => {
                    return <Stack direction={"row"} spacing={2} key={index}>
                        <Typography width={20} display="inline">{day + ":"}</Typography>
                        {editingState ? <TextFieldElement name={"opening" + index} size="small" value={"TEXT FIELD"}/> :
                            <Typography display="inline">LABEL</Typography>}
                    </Stack>
                })}
            </Stack>
        </>
    )
}

function Contact(editable: boolean) {
    const [editingState, setEditingState] = useState(false);
    return (
        <>
            <Box>
                <Typography
                    variant="subtitle1"
                    color={"primary.main"}
                    display="inline"
                > Kontakt
                </Typography>
                {editable && <IconButton onClick={() => setEditingState(!editingState)}
                                         type={!editingState ? "submit" : undefined}>
                    <EditIcon/>
                </IconButton>}
            </Box>
            <Stack spacing={editingState ? 2 : 0}>
                {/*TODO: add validation and potentially refactor to one*/}
                <Stack direction={"row"} spacing={2}>
                    <Typography width={40} display="inline">Email:</Typography>
                    {editingState ? <TextFieldElement name={"email"} type="email" size="small" value={"TEXT FIELD"}/> :
                        <Typography display="inline">LABEL</Typography>}
                </Stack>
                <Stack direction={"row"} spacing={2}>
                    <Typography width={40} display="inline">Tel:</Typography>
                    {editingState ? <TextFieldElement name={"phone"} size="small" value={"TEXT FIELD"}/> :
                        <Typography display="inline">LABEL</Typography>}
                </Stack>
                <Stack direction={"row"} spacing={2}>
                    <Typography width={40} display="inline">Web:</Typography>
                    {editingState ? <TextFieldElement name={"web"} size="small" value={"TEXT FIELD"}/> :
                        <Typography display="inline">LABEL</Typography>}
                </Stack>
            </Stack>
        </>)
}

function Languages(editable: boolean) {
    const [editingState, setEditingState] = useState(false);
    // TODO: change to languages type
    return (
        <>
            <Box>
                <Typography
                    variant="subtitle1"
                    color={"primary.main"}
                    display="inline"
                > Jazyky
                </Typography>
                {editable && <IconButton onClick={() => setEditingState(!editingState)}
                                         type={!editingState ? "submit" : undefined}>
                    <EditIcon/>
                </IconButton>}
            </Box>
            {
                editingState ?
                    <MultiSelectElement label="Jazyky" showCheckbox name="languages" menuItems={languages}/> :
                    <Typography display="inline">LABEL</Typography>
            }
        </>
    )
}

function Description(editable: boolean) {
    const [editingState, setEditingState] = useState(false);
    // TODO: change to languages type
    return (
        <>
            <Box>
                <Typography
                    variant="subtitle1"
                    color={"primary.main"}
                    display="inline"
                > Popis
                </Typography>
                {editable && <IconButton onClick={() => setEditingState(!editingState)}
                                         type={!editingState ? "submit" : undefined}>
                    <EditIcon/>
                </IconButton>}
            </Box>
            {
                editingState ? <TextFieldElement name={"web"} size="small" value={"TEXT FIELD"} multiline/> :
                    <Typography display="inline">LABEL</Typography>
            }
        </>)
}

/*TODO: property *editable* depends on status (logged in/out) */
export function InfoPanel(editable: boolean) {
    const formContext = useForm<string[]>();
    const {handleSubmit} = formContext;
    const onSubmit = handleSubmit((formData: string[]) => {
        // TODO: send data to database on this click
        console.log(formData)
    });
    // @ts-ignore
    return (<FormContainer
        formContext={formContext}
        handleSubmit={onSubmit}>
        <Stack spacing={2}>
            <Opening {...editable}/>
            <Contact {...editable}/>
            <Languages {...editable}/>
            <Description {...editable}/>
            <Grid container>
                <Grid item xs={6}>
                    <Button variant='contained' type={'submit'} color={'primary'} onSubmit={onSubmit}>Uložit změny</Button>
                </Grid>
                <Grid item xs={6}>
                    {/*TODO: change onSubmit to function resetting form (refresh page basically)*/}
                    <Button variant='contained' type={'submit'} color={'primary'} onClick={onSubmit}>Zrušit změny</Button>
                </Grid>
            </Grid>
        </Stack>
    </FormContainer>)
}
