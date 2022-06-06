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
import {IDoctorDetailInfo, IFormPerson} from "../../utils/Interfaces";
import {IDatDoctorDetail, IDatDoctorInfo, IDatPersonReservation} from "../../utils/DatabaseInterfaces";
import axios from "axios";

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
                        <TextFieldElement name={"openingHours" + (index)} size="small"
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

export function InfoPanel(info: IDoctorDetailInfo) {

    const storeInfo = async (formData: IDoctorDetailInfo) => {
        const detail: IDatDoctorInfo = {
            description: formData.description,
            languages: formData.languages,
            link: formData.web,
            openingHours: [formData.openingHours0, formData.openingHours1, formData.openingHours2, formData.openingHours3,
                formData.openingHours4, formData.openingHours5, formData.openingHours6],
            workEmail: formData.email,
            workPhone: formData.phone ? parseInt(formData.phone) : undefined,
        }

        // TODO: check and update request, update url
        const url = "";
        await axios.put(url, {
            detail,
            headers: {
                'Authorization': `Bearer ${user.token}`
            }})
            .then(response => {
                console.log(response);
            })
            .catch((error) => {
                console.error(error);
                alert("Aktualizace selhala!\n\n" + error.response.data.message)
            });
    }

    const onSubmit = (formData: IDoctorDetailInfo) => {
        // TODO: send data to database on this click
        console.log(formData);
        storeInfo(formData);
    };

    const user = useRecoilValue(userAtom)
    const {id} = useParams();
    const {reset, handleSubmit} = useForm<IDoctorDetailInfo>();

    // TODO: fix reset (removing context removed reset)

    // @ts-ignore
    return (<FormContainer
        defaultValues={info}
        onSuccess={onSubmit}>
        <Stack spacing={2}>
            <Opening/>
            <Contact/>
            <Languages/>
            <Description/>
            {user.id == id && <Grid container>
                <Grid container item xs={6} justifyContent={"center"}>
                    <Button variant='contained' size={"large"} type={'submit'} color={'primary'}>Uložit
                        změny</Button>
                </Grid>
                <Grid container item xs={6} justifyContent={"center"}>
                    <Button variant='contained' size={"large"} color={'primary'} onClick={() => reset()} >Zrušit
                        změny</Button>
                </Grid>
            </Grid>}
        </Stack>
    </FormContainer>)
}

