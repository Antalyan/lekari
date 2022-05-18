import * as React from "react";
import {useState} from "react";
import Grid from "@mui/material/Grid";
import {IconButton, Stack} from "@mui/material";
import Button from "@mui/material/Button";
import EditIcon from '@mui/icons-material/Edit';
import {IEditable} from "../Interfaces";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {FormContainer, MultiSelectElement, TextFieldElement} from "react-hook-form-mui";
import {useForm} from "react-hook-form";
import {DAYS, LANGUAGES} from "../../data/Constants";

function Opening({editable}: IEditable) {
    // TODO: editability should be checked at backend on submit as well
    const [editingState, setEditingState] = useState(false);
    return (
        <>
            <Box>
                <Typography
                    variant="subtitle1"
                    color={"primary.main"}
                    display="inline"
                > Otevírací doba
                </Typography>
                {editable && <IconButton onClick={() => setEditingState(!editingState)}>
                    <EditIcon/>
                </IconButton>}
            </Box>

            <Stack spacing={editingState ? 2 : 0}>
                {DAYS.map((day, index) => {
                    return <Stack direction={"row"} spacing={2} key={index}>
                        <Typography width={60} display="inline">{day + ":"}</Typography>
                        <TextFieldElement name={"opening" + index} size="small"
                                          disabled={!editingState} variant={editingState ? "outlined" : "standard"}
                                          InputProps={{
                                              disableUnderline: !editingState,
                                          }}
                        />
                    </Stack>
                })}
            </Stack>
        </>
    )
}

function Contact({editable}: IEditable) {
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
                {editable && <IconButton onClick={() => setEditingState(!editingState)}>
                    <EditIcon/>
                </IconButton>}
            </Box>
            <Stack spacing={editingState ? 2 : 0}>
                {/*TODO: add validation and potentially refactor to one*/}
                <Stack direction={"row"} spacing={2}>
                    <Typography width={40} display="inline">Email:</Typography>
                    <TextFieldElement name={"email"} size="small" type="email"
                                      disabled={!editingState} variant={editingState ? "outlined" : "standard"}
                                      InputProps={{
                                          disableUnderline: !editingState,
                                      }}
                    />
                </Stack>
                <Stack direction={"row"} spacing={2}>
                    <Typography width={40} display="inline">Tel:</Typography>
                    <TextFieldElement name={"phone"} size="small"
                                      disabled={!editingState} variant={editingState ? "outlined" : "standard"}
                                      InputProps={{
                                          disableUnderline: !editingState,
                                      }}
                    />
                </Stack>
                <Stack direction={"row"} spacing={2}>
                    <Typography width={40} display="inline">Web:</Typography>
                    <TextFieldElement name={"web"} size="small"
                                      disabled={!editingState} variant={editingState ? "outlined" : "standard"}
                                      InputProps={{
                                          disableUnderline: !editingState,
                                      }}
                    />
                </Stack>
            </Stack>
        </>)
}

function Languages({editable}: IEditable) {
// TODO: change to languages type
    const [editingState, setEditingState] = useState(false);
    return (
        <>
            <Box>
                <Typography
                    variant="subtitle1"
                    color={"primary.main"}
                    display="inline"
                > Jazyky
                </Typography>
                {editable && <IconButton onClick={() => setEditingState(!editingState)}>
                    <EditIcon/>
                </IconButton>}
            </Box>
            <MultiSelectElement showCheckbox name="languages" menuItems={LANGUAGES}
                                disabled={!editingState} variant={editingState ? "outlined" : "standard"}
                                disableUnderline
            />
        </>
    )
}

function Description({editable}: IEditable) {
    const [editingState, setEditingState] = useState(false);
    return (
        <>
            <Box>
                <Typography
                    variant="subtitle1"
                    color={"primary.main"}
                    display="inline"
                > Popis
                </Typography>
                {editable && <IconButton onClick={() => setEditingState(!editingState)}>
                    <EditIcon/>
                </IconButton>}
            </Box>
            <TextFieldElement name={"description"} size="small" multiline
                              disabled={!editingState} variant={editingState ? "outlined" : "standard"}
                              InputProps={{
                                  disableUnderline: !editingState,
                              }}
            />
        </>)
}

/*TODO: property *editable* depends on status (logged in/out) */
export function InfoPanel({editable}: IEditable) {
    const formContext = useForm<string[]>();
    const {handleSubmit} = formContext;
    const onSubmit = handleSubmit((formData: string[]) => {
        // TODO: send data to database on this click
        console.log(formData);
        console.log("XXX")
    });
    // @ts-ignore
    return (<FormContainer
        formContext={formContext}
        handleSubmit={onSubmit}>
        <Stack spacing={2}>
            <Opening editable={editable}/>
            <Contact editable={editable}/>
            <Languages editable={editable}/>
            <Description editable={editable}/>
            <Grid container>
                <Grid item xs={6}>
                    <Button variant='contained' type={'submit'} color={'primary'} onSubmit={onSubmit}>Uložit
                        změny</Button>
                </Grid>
                <Grid item xs={6}>
                    {/*TODO: change onSubmit to function resetting form (refresh page basically)*/}
                    <Button variant='contained' type={'submit'} color={'primary'} onClick={onSubmit}>Zrušit
                        změny</Button>
                </Grid>
            </Grid>
        </Stack>
    </FormContainer>)
}
