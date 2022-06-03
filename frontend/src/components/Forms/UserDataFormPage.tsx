import {FormContainer, PasswordElement} from "react-hook-form-mui";
import {Box, Button, Grid, IconButton, Stack, styled, Typography} from "@mui/material";
import {useForm, useFormContext} from "react-hook-form";
import * as React from "react";
import {FunctionComponent} from "react";
import {IEditable, IForm, IFormPerson} from "../../utils/Interfaces";
import {countries} from "../../data/Countries";
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import {DataFormType, validateNumbers} from "../../data/Constants";
import {PhotoCamera} from "@mui/icons-material";
import {specializations} from "../../data/MockData";
import {FormDatePicker, FormSelect, FormTextField} from "./FormComponents";
import Header from "../Header";
import {Footer} from "../Footer";
import {useRecoilState} from "recoil";
import {userAtom} from "../../state/LoggedInAtom";
import {DeleteProfileDialog} from "./DeleteProfileDialog";
import {useNavigate} from "react-router-dom";

function getFormLabel(type: DataFormType, isEdit: boolean): string {
    if (isEdit) {
        return "Můj profil"
    }
    switch (type) {
        case DataFormType.Doctor:
            return "Registrace lékaře"
        case DataFormType.Patient:
            return "Registrace pacienta"
        case DataFormType.Reservation:
            return "Rezervace"
        case DataFormType.Invalid:
            return "INVALID"
    }
}

function PasswordRepeat (editable: IEditable) {
    const {getValues} = useFormContext()
    return (
        <PasswordElement label={'Nové heslo znovu'}
                         required={!editable} fullWidth
                         validation={{
                             validate: (value: string) => {
                                 const {newPassword} = getValues()
                                 return value === newPassword || 'Password should match'
                             }
                         }}
                         name={'passwordCheck'}
        />
    )
}

export function UserDataFormPage({type, isEdit}: IForm) {
    let navigate = useNavigate()
    const formContext = useForm<IFormPerson>()
    const {handleSubmit} = formContext

    const onSubmit = handleSubmit((formData: IFormPerson) => {
        // TODO: store data to database, should depend on form type: save as new OR update
        console.log(formData)
        // TODO: show message about success / error, redirect only on success
        navigate("/")
    })

    let copiedCountries = countries.map((country) => country.label)
    copiedCountries.sort()
    const countryOptions = copiedCountries.map((country, index) => {
        return {
            "id": index + 1,
            "title": country
        }
    })
    const phoneOptions = countries.map((country, index) => {
        return {
            "id": index + 1,
            "title": country.label + ": +" + country.phone
        }
    })

    //TODO: replace specializations with real specializations, will they be retrieved from db or stored on FE?
    let copiedSpecs = specializations;
    copiedSpecs.sort()
    const specializationOptions = copiedSpecs.map((spec, index) => {
        return {
            "id": index + 1,
            "title": spec
        }
    })

    const Input = styled('input')({
        display: 'none',
    });

    const [user, setUser] = useRecoilState(userAtom)
    if (!isEdit && user.id != null) {
        // TODO: add popup info that you will be logged out
        // TODO: logout automatically
        setUser({})
    }

    if (type == DataFormType.Invalid) {
        return <>
            INVALID PAGE!
        </>
    }

    return (
        <>
            <Header/>
            <Typography variant="h5" gutterBottom component="div" align={"center"}
                        bgcolor={"primary.main"} color={"common.white"}
                        padding={2} marginTop={1}>
                {getFormLabel(type, isEdit)}
            </Typography>
            <Box
                display="flex"
                justifyContent="center"
                minHeight="100vh"
                margin={4}
            >
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    {/*@ts-ignore*/}
                    <FormContainer
                        formContext={formContext}
                        handleSubmit={onSubmit}>
                        <Grid container spacing={2} alignItems="center" justifyContent={"center"} marginLeft={{md: "auto"}}
                              marginRight={{md: "auto"}}
                              maxWidth={{md: 500}}>
                            <Grid item xs={12}>
                                <Typography variant="h5" gutterBottom component="div" align={"center"}
                                            color={"text.secondary"}
                                            padding={2}>
                                    Osobní údaje
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <FormTextField isEdit={isEdit} name={'degree'} label={'Titul'}/>
                            </Grid>
                            <Grid item xs={12}>
                                <FormTextField isEdit={isEdit} name={'name'} label={'Jméno'} required={true} fullWidth/>
                            </Grid>
                            <Grid item xs={12}>
                                <FormTextField isEdit={isEdit} name={'surname'} label={'Příjmení'} required={true}
                                               fullWidth/>
                            </Grid>
                            <Grid item xs={12}>
                                <FormTextField isEdit={isEdit} name={'street'} label={'Ulice'} fullWidth/>
                            </Grid>
                            <Grid item xs={6}>
                                <FormTextField isEdit={isEdit} name={'streetNumber'} label={'Číslo popisné'}
                                               required={type != DataFormType.Reservation}
                                               fullWidth
                                               validation={validateNumbers}/>
                            </Grid>
                            <Grid item xs={6}>
                                <FormTextField isEdit={isEdit} name={'postalCode'} label={'PSČ'}
                                               required={type != DataFormType.Reservation}
                                               fullWidth
                                               validation={validateNumbers}/>
                            </Grid>
                            <Grid item xs={12}>
                                <FormTextField isEdit={isEdit} name={'city'} label={'Město'}
                                               required={type != DataFormType.Reservation}
                                               fullWidth/>
                            </Grid>
                            <Grid item xs={12}>
                                <FormSelect isEdit={isEdit} name={'country'} label={'Stát'}
                                            required={type != DataFormType.Reservation}
                                            fullWidth
                                            options={countryOptions}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormDatePicker isEdit={isEdit} name={'birthdate'} label={'Datum narození'} required/>
                            </Grid>
                            <Grid item xs={12}>
                                <FormTextField isEdit={isEdit} name={'email'} label={'Email'} type={'email'} required
                                               fullWidth/>
                            </Grid>
                            <Grid item xs={12}>
                                <FormSelect isEdit={isEdit} name={'phoneCode'} label={'Předvolba'} required fullWidth
                                            options={phoneOptions}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormTextField isEdit={isEdit} name={'phone'} label={'Telefon'} required fullWidth
                                               validation={validateNumbers}/>
                            </Grid>
                            <Grid item xs={12}>
                                <FormTextField isEdit={isEdit} name={'insuranceNumber'} label={'Číslo pojišťovny'}
                                               validation={validateNumbers}/>
                            </Grid>

                            {type == DataFormType.Doctor &&
                                <>
                                    <Grid item xs={12}>
                                        <Typography variant="h5" gutterBottom component="div" align={"center"}
                                                    color={"text.secondary"}
                                                    padding={2}>
                                            Údaje o ordinaci (pro pacienty)
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormSelect isEdit={isEdit} name={'specialization'} label={'Specializace'}
                                                    fullWidth required
                                                    options={specializationOptions}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormTextField isEdit={isEdit} name={'status'} label={'Aktualita pro pacienty'}
                                                       fullWidth/>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormTextField isEdit={isEdit} name={'doctorStreet'} label={'Ulice'} fullWidth/>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <FormTextField isEdit={isEdit} name={'doctorStreetNumber'}
                                                       label={'Číslo popisné'}
                                                       fullWidth
                                                       validation={validateNumbers}/>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <FormTextField isEdit={isEdit} name={'doctorPostalCode'} label={'PSČ'}
                                                       fullWidth
                                                       validation={validateNumbers}/>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormTextField isEdit={isEdit} name={'doctorCity'} label={'Město'}
                                                       fullWidth/>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormSelect isEdit={isEdit} name={'doctorCountry'} label={'Stát'}
                                                    fullWidth
                                                    options={countryOptions}
                                        />
                                    </Grid>
                                </>}
                            {type != DataFormType.Reservation &&
                                <>
                                    <Grid item xs={12}>
                                        <Typography variant="h5" gutterBottom component="div" align={"center"}
                                                    color={"text.secondary"}
                                                    padding={2}>
                                            Profil
                                        </Typography>
                                    </Grid>
                                    {isEdit && <Grid item xs={12}>
                                        <PasswordElement name={'oldPassword'} label={'Staré heslo'}
                                                         autoComplete="new-password"
                                                         required={!isEdit}
                                                         fullWidth/>
                                    </Grid>}
                                    <Grid item xs={12}>
                                        <PasswordElement name={'newPassword'} label={"Nové heslo"}
                                                         autoComplete="new-password"
                                                         required={!isEdit}
                                                         fullWidth/>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <PasswordRepeat editable={isEdit}/>
                                    </Grid>
                                    <Grid item xs={11}>
                                        <label htmlFor="icon-button-file">
                                            <Typography display={"inline"} color="text.secondary">Profilové
                                                foto</Typography>
                                            <Input accept="image/*" id="icon-button-file" type="file"/>
                                            {/*TODO: handle image upload*/}
                                            <IconButton color="primary" aria-label="upload picture" component="span">
                                                <PhotoCamera/>
                                            </IconButton>
                                        </label>
                                    </Grid>
                                </>}

                            <Grid item xs={12}>
                                <Stack direction="row" justifyContent="space-evenly" spacing={2}>
                                    {isEdit ?
                                        <>
                                            <Button variant='contained' type={'submit'} color={'primary'}
                                                    onSubmit={onSubmit}>{"Uložit změny"}</Button>
                                            <Button variant='contained' color={'primary'}
                                            >{"Zrušit změny"}</Button>
                                        </>
                                        : <Button variant='contained' type={'submit'} color={'primary'}
                                                  onSubmit={onSubmit}>{"Registrovat se"}</Button>}
                                </Stack>
                            </Grid>

                            {isEdit && <Grid item xs={11}>
                                <DeleteProfileDialog/>
                            </Grid>}
                        </Grid>
                    </FormContainer>
                </LocalizationProvider>
            </Box>
            <Footer/>
        </>
    )
}


