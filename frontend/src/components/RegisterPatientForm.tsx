import {DatePickerElement, FormContainer, PasswordElement, SelectElement, TextFieldElement} from "react-hook-form-mui";
import {Box, Button, Grid, IconButton, styled, Typography} from "@mui/material";
import {useForm, useFormContext} from "react-hook-form";
import {ChangeEvent, FunctionComponent, useState} from "react";
import {ILogin, IPatient} from "./Interfaces";
import * as React from "react";
import {countries} from "../data/Countries";
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import {PhotoCamera} from "@mui/icons-material";

const validateNumbers = {pattern: {value: /^[0-9]+$/, message: "Input must be only numeric"}}

export function RegisterPatientForm() {
    const formContext = useForm<IPatient>()
    const {handleSubmit} = formContext

    const onSubmit = handleSubmit((formData: IPatient) => {
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
                Registrace
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
                                <TextFieldElement name={'streetNumber'} label={'Číslo popisné'} required fullWidth
                                                  validation={validateNumbers}/>
                            </Grid>
                            <Grid item xs={6}>
                                <TextFieldElement name={'postalCode'} label={'PSČ'} required fullWidth
                                                  validation={validateNumbers}/>
                            </Grid>
                            <Grid item xs={12}>
                                <TextFieldElement name={'city'} label={'Město'} required fullWidth/>
                            </Grid>
                            <Grid item xs={12}>
                                <SelectElement name={'country'} label={'Stát'} required fullWidth
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
                            <Grid item xs={12}>
                                <PasswordElement name={'password'} label={'Heslo'} autoComplete="new-password" required
                                                 fullWidth/>
                            </Grid>
                            <Grid item xs={12}>
                                <PasswordRepeat/>
                            </Grid>
                            <Grid item xs={11}>
                                <label htmlFor="icon-button-file">
                                    <Typography display={"inline"} color="text.secondary">Profilové foto</Typography>
                                    <Input accept="image/*" id="icon-button-file" type="file" />
                                    <IconButton color="primary" aria-label="upload picture" component="span">
                                        <PhotoCamera />
                                    </IconButton>
                                </label>
                            </Grid>

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


