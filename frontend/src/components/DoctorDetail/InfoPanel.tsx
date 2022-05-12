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
    const formContext = useForm<string[]>();
    const {handleSubmit} = formContext;
    const onSubmit = handleSubmit((formData: string[]) => {
        console.log(formData)
    });
    return (
        // @ts-ignore
        <FormContainer
            formContext={formContext}
            handleSubmit={onSubmit}>
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
        </FormContainer>)
}

function Contact(editable: boolean) {
    const [editingState, setEditingState] = useState(false);
    const formContext = useForm<IContact>();
    const {handleSubmit} = formContext;
    const onSubmit = handleSubmit((formData: IContact) => {
        console.log(formData)
    });
    return (
        // @ts-ignore
        <FormContainer
            formContext={formContext}
            handleSubmit={onSubmit}>
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
        </FormContainer>)
}

function Languages(editable: boolean) {
    const [editingState, setEditingState] = useState(false);
    // TODO: change to languages type
    const formContext = useForm<string[]>();
    const {handleSubmit} = formContext;
    const onSubmit = handleSubmit((formData: string[]) => {
        console.log(formData)
    });
    return (
        // @ts-ignore
        <FormContainer
            formContext={formContext}
            handleSubmit={onSubmit}>
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
            {editingState ? <MultiSelectElement label="Jazyky" showCheckbox name="languages" menuItems={languages}/> :
                <Typography display="inline">LABEL</Typography>}
        </FormContainer>)
}

function Description(editable: boolean) {
    const [editingState, setEditingState] = useState(false);
    // TODO: change to languages type
    const formContext = useForm<string[]>();
    const {handleSubmit} = formContext;
    const onSubmit = handleSubmit((formData: string[]) => {
        console.log(formData)
    });
    return (
        // @ts-ignore
        <FormContainer
            formContext={formContext}
            handleSubmit={onSubmit}>
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
            {editingState ? <TextFieldElement name={"web"} size="small" value={"TEXT FIELD"} multiline/> :
                <Typography display="inline">LABEL</Typography>}
        </FormContainer>)
}


/*TODO: property *editable* depends on status (logged in/out) */
export function InfoPanel(editable: boolean) {
    return <Stack spacing={4}>
        <Opening {...editable}/>
        <Contact {...editable}/>
        <Languages {...editable}/>
        <Description {...editable}/>
    </Stack>
}
