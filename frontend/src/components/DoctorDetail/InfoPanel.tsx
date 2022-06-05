import * as React from "react";
import {useState} from "react";
import Grid from "@mui/material/Grid";
import {IconButton, Stack} from "@mui/material";
import Button from "@mui/material/Button";
import EditIcon from '@mui/icons-material/Edit';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {FormContainer, MultiSelectElement, TextFieldElement} from "react-hook-form-mui";
import {useForm} from "react-hook-form";
import {DAYS, LANGUAGES, validateNumbers, validateUrl} from "../../data/Constants";
import {useRecoilValue} from "recoil";
import {userAtom} from "../../state/LoggedInAtom";
import {useParams} from "react-router-dom";

function Opening() {
    // TODO: editability could be checked at backend on submit as well?
    const [editingState, setEditingState] = useState(false);
    const user = useRecoilValue(userAtom)
    const {id} = useParams();

    return (
        <>
            <Box>
                <Typography
                    variant="h6"
                    color={"primary.main"}
                    display="inline"
                    fontWeight={"bold"}
                > Otevírací doba
                </Typography>
                {user.id == id && <IconButton onClick={() => setEditingState(!editingState)}>
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

function Contact() {
    const [editingState, setEditingState] = useState(false);
    const user = useRecoilValue(userAtom)
    const {id} = useParams();
    return (
        <>
            <Box>
                <Typography
                    variant="h6"
                    color={"primary.main"}
                    display="inline"
                > Kontakt
                </Typography>
                {user.id == id && <IconButton onClick={() => setEditingState(!editingState)}>
                    <EditIcon/>
                </IconButton>}
            </Box>
            <Stack spacing={editingState ? 2 : 0}>
                <Stack direction={"row"} spacing={2}>
                    <Typography width={40} display="inline">Email:</Typography>
                    <TextFieldElement name={"email"} size="small" type="email"
                                      disabled={!editingState} variant={editingState ? "outlined" : "standard"}
                                      InputProps={{
                                          disableUnderline: !editingState,
                                          fullWidth: true
                                      }}
                    />
                </Stack>
                <Stack direction={"row"} spacing={2}>
                    <Typography width={40} display="inline">Tel:</Typography>
                    <TextFieldElement name={"phone"} size="small" validation={validateNumbers}
                                      disabled={!editingState} variant={editingState ? "outlined" : "standard"}
                                      InputProps={{
                                          disableUnderline: !editingState,
                                      }}
                    />
                </Stack>
                <Stack direction={"row"} spacing={2}>
                    <Typography width={40} display="inline">Web:</Typography>
                    <TextFieldElement name={"web"} size="small" validation={validateUrl}
                                      disabled={!editingState} variant={editingState ? "outlined" : "standard"}
                                      InputProps={{
                                          disableUnderline: !editingState,
                                      }}
                    />
                </Stack>
            </Stack>
        </>)
}

function Languages() {
    const [editingState, setEditingState] = useState(false);
    const user = useRecoilValue(userAtom)
    const {id} = useParams();
    return (
        <>
            <Box>
                <Typography
                    variant="h6"
                    color={"primary.main"}
                    display="inline"
                > Jazyky
                </Typography>
                {user.id == id && <IconButton onClick={() => setEditingState(!editingState)}>
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

function Description() {
    const [editingState, setEditingState] = useState(false);
    const user = useRecoilValue(userAtom)
    const {id} = useParams();
    return (
        <>
            <Box>
                <Typography
                    variant="h6"
                    color={"primary.main"}
                    display="inline"
                > Popis
                </Typography>
                {user.id == id && <IconButton onClick={() => setEditingState(!editingState)}>
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

export function InfoPanel() {
    const formContext = useForm<string[]>();
    const {handleSubmit} = formContext;
    const onSubmit = handleSubmit((formData: string[]) => {
        // TODO: send data to database on this click and show confirmation?
        console.log(formData);
    });

    const user = useRecoilValue(userAtom)
    const {id} = useParams();

    const onReset = () => {
        formContext.reset();
    }
    // @ts-ignore
    return (<FormContainer
        formContext={formContext}
        handleSubmit={onSubmit}>
        <Stack spacing={2}>
            <Opening/>
            <Contact/>
            <Languages/>
            <Description/>
            {user.id == id && <Grid container>
                <Grid container item xs={6} justifyContent={"center"}>
                    <Button variant='contained' size={"large"} type={'submit'} color={'primary'} onSubmit={onSubmit}>Uložit
                        změny</Button>
                </Grid>
                <Grid container item xs={6} justifyContent={"center"}>
                    <Button variant='contained' size={"large"} type={'submit'} color={'primary'} onClick={onReset} >Zrušit
                        změny</Button>
                </Grid>
            </Grid>}
        </Stack>
    </FormContainer>)
}

