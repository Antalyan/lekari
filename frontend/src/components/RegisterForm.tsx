import {DatePickerElement, FormContainer, PasswordElement, SelectElement, TextFieldElement} from "react-hook-form-mui";
import {Box, Button, Grid, IconButton, styled, Typography} from "@mui/material";
import {useForm, useFormContext} from "react-hook-form";
import * as React from "react";
import {FunctionComponent} from "react";
import {IForm, IPatient} from "./Interfaces";
import {countries} from "../data/Countries";
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import {DataFormType} from "../data/Constants";
import {PhotoCamera} from "@mui/icons-material";
import {specializations} from "../data/MockData";

const validateNumbers = {pattern: {value: /^[0-9]*$/, message: "Input must be only numeric"}}

function getFormLabel(type: DataFormType): string {
    switch (type) {
        case DataFormType.Doctor:
            return "Registrace lékaře"
        case DataFormType.Patient:
            return "Registrace pacienta"
        case DataFormType.Reservation:
            return "Rezervace"
    }
}

export function RegisterForm({type}: IForm) {
    //TODO: change type of form to correspond to generalized form
    const formContext = useForm()
    const {handleSubmit} = formContext

    const onSubmit = handleSubmit((formData) => {
        // TODO: handle action should depend on form type
        console.log(formData)
    })

    let copiedCountries = countries.map((country) => country.label)
    copiedCountries.sort()
    const countryOptions = copiedCountries.map((country, index) => {
        return {
            "id": index + 1,
            "title": country
        }
    })

    let copiedSpecs = specializations;
    copiedSpecs.sort()
    const specializationOptions = copiedSpecs.map((spec, index) => {
        return {
            "id": index + 1,
            "title": spec
        }
    })

    const phoneOptions = countries.map((country, index) => {
        return {
            "id": index + 1,
            "title": country.label + ": +" + country.phone
        }
    })

    const PasswordRepeat: FunctionComponent = () => {
        const {getValues} = useFormContext()
        return (
            <PasswordElement label={'Heslo znovu'}
                             required fullWidth
                             validation={{
                                 validate: (value: string) => {
                                     const {password} = getValues()
                                     return value === password || 'Password should match'
                                 }
                             }}
                             name={'passwordCheck'}
            />
        )
    }

    const Input = styled('input')({
        display: 'none',
    });

    return (
        <>
            <Typography variant="h5" gutterBottom component="div" align={"center"}
                        bgcolor={"primary.main"} color={"common.white"}
                        padding={2}>
                {getFormLabel(type)}
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
                        <Grid container spacing={2} alignItems="center" justifyContent={"center"}>
                            <Grid item xs={12}>
                                <Typography variant="h5" gutterBottom component="div" align={"center"}
                                            color={"text.secondary"}
                                            padding={2}>
                                    Osobní údaje
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <TextFieldElement name={'title'} label={'Titul'}/>
                            </Grid>
                            <Grid item xs={12}>
                                <TextFieldElement name={'name'} label={'Jméno'} required fullWidth/>
                            </Grid>
                            <Grid item xs={12}>
                                <TextFieldElement name={'surname'} label={'Příjmení'} required fullWidth/>
                            </Grid>
                            <Grid item xs={12}>
                                <TextFieldElement name={'street'} label={'Ulice'} fullWidth/>
                            </Grid>
                            <Grid item xs={6}>
                                <TextFieldElement name={'streetNumber'} label={'Číslo popisné'}
                                                  required={type != DataFormType.Reservation}
                                                  fullWidth
                                                  validation={validateNumbers}/>
                            </Grid>
                            <Grid item xs={6}>
                                <TextFieldElement name={'postalCode'} label={'PSČ'}
                                                  required={type != DataFormType.Reservation}
                                                  fullWidth
                                                  validation={validateNumbers}/>
                            </Grid>
                            <Grid item xs={12}>
                                <TextFieldElement name={'city'} label={'Město'}
                                                  required={type != DataFormType.Reservation}
                                                  fullWidth/>
                            </Grid>
                            <Grid item xs={12}>
                                <SelectElement name={'country'} label={'Stát'}
                                               required={type != DataFormType.Reservation}
                                               fullWidth
                                               options={countryOptions}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <DatePickerElement name={'birthdate'} label={'Datum narození'} required/>
                            </Grid>
                            <Grid item xs={12}>
                                <TextFieldElement name={'email'} label={'Email'} type={'email'} required fullWidth/>
                            </Grid>
                            <Grid item xs={12}>
                                <SelectElement name={'phoneCode'} label={'Předvolba'} required fullWidth
                                               options={phoneOptions}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextFieldElement name={'phone'} label={'Telefon'} required fullWidth
                                                  validation={validateNumbers}/>
                            </Grid>
                            <Grid item xs={12}>
                                <TextFieldElement name={'insuranceNumber'} label={'Číslo pojišťovny'}
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
                                        <SelectElement name={'specialization'} label={'Specializace'}
                                                       fullWidth required
                                                       options={specializationOptions}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextFieldElement name={'status'} label={'Aktualita pro pacienty'} fullWidth/>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextFieldElement name={'doctorStreet'} label={'Ulice'} fullWidth/>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextFieldElement name={'doctorStreetNumber'} label={'Číslo popisné'}
                                                          fullWidth
                                                          validation={validateNumbers}/>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextFieldElement name={'doctorPostalCode'} label={'PSČ'}
                                                          fullWidth
                                                          validation={validateNumbers}/>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextFieldElement name={'doctorCity'} label={'Město'}
                                                          fullWidth/>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <SelectElement name={'doctorCountry'} label={'Stát'}
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
                                    <Grid item xs={12}>
                                        <PasswordElement name={'password'} label={'Heslo'} autoComplete="new-password"
                                                         required
                                                         fullWidth/>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <PasswordRepeat/>
                                    </Grid>
                                    <Grid item xs={11}>
                                        <label htmlFor="icon-button-file">
                                            <Typography display={"inline"} color="text.secondary">Profilové
                                                foto</Typography>
                                            <Input accept="image/*" id="icon-button-file" type="file"/>
                                            <IconButton color="primary" aria-label="upload picture" component="span">
                                                <PhotoCamera/>
                                            </IconButton>
                                        </label>
                                    </Grid>
                                </>}

                            <Grid item xs={12}>
                                <Box display="flex" justifyContent="center">
                                    <Button variant='contained' type={'submit'} color={'primary'}
                                            onSubmit={onSubmit}>{"Registrovat se"}</Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </FormContainer>
                </LocalizationProvider>
            </Box>
        </>
    )
}


