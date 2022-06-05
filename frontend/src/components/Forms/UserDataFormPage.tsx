import {FormContainer, PasswordElement} from "react-hook-form-mui";
import {Box, Button, Grid, IconButton, Stack, styled, Typography} from "@mui/material";
import {useForm, useFormContext} from "react-hook-form";
import * as React from "react";
import {IBasicDoctor, IEditable, IForm, IFormPerson} from "../../utils/Interfaces";
import {
    COUNTRIES,
    findPhoneCodeName,
    findCountryName,
    findCountryIndex,
    findPhoneCodeIndex
} from "../../data/Countries";
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import {DataFormType, validateNumbers} from "../../data/Constants";
import {PhotoCamera} from "@mui/icons-material";
import {specializations} from "../../data/MockData";
import {FormDatePicker, FormSelect, FormTextField} from "./FormComponents";
import Header from "../Header";
import {Footer} from "../Footer";
import {useRecoilValue} from "recoil";
import {userAtom} from "../../state/LoggedInAtom";
import {DeleteProfileDialog} from "./DeleteProfileDialog";
import {NavigateFunction, useNavigate} from "react-router-dom";
import axios from 'axios';
import {IDatBasicDoctor, IDatDoctorProfile, IDatPatientProfile} from "../../utils/DatabaseInterfaces";
import useSWR from "swr";
import fetcher, {fetcherWithToken} from "../../utils/fetcher";
import {findSpecializationIndex, findSpecializationName, SPECIALIZATIONS} from "../../data/Specializations";

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

function PasswordRepeat(editable: IEditable) {
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

async function completeRegistration(url: string, subject: any, navigate: NavigateFunction) {
    await axios.post(url, subject)
        .then(response => {
            console.log(response);
            if (response.data.status === "success") {
                alert("Registrace úspěšná! Nyní se můžete přihlásit.");
                navigate("/");
            }
        })
        .catch((error) => {
            console.error(error);
            alert("Registrace selhala!\n\n" + error.response.data.message)
        });
}

async function updateProfile(url: string, subject: any, navigate: NavigateFunction) {
    await axios.put(url, subject)
        .then(response => {
            console.log(response);
            if (response.data.status === "success") {
                navigate("/");
            }
        })
        .catch((error) => {
            console.error(error);
            alert("Aktualizace selhala!\n\n" + error.response.data.message)
        });
}

export function UserDataFormPage({type, isEdit}: IForm) {
    const getDefaultValues = () => {
        // TODO: check default attributes when API edit finished
        const dbperson: IDatPatientProfile | IDatDoctorProfile = data.data;
        return {
            name: dbperson.firstname,
            surname: dbperson.surname,
            degree: dbperson.degree,
            birthdate: dbperson.birthdate,
            street: dbperson.street,
            streetNumber: dbperson.buildingNumber,
            city: dbperson.city,
            postalCode: dbperson.postalCode?.toString(),
            country: findCountryIndex(dbperson.country),
            email: dbperson.email,
            phoneCode: dbperson.phonePrefix === undefined ? undefined : findPhoneCodeIndex(dbperson.phonePrefix),
            phone: dbperson.phone?.toString(),
            insuranceNumber: dbperson.insuranceNumber?.toString(),
            profilePicture: "",
            specialization: "specialization" in dbperson ? findSpecializationIndex(dbperson.specialization) : undefined,
            status: "actuality" in dbperson ? dbperson.actuality : undefined,
            doctorStreet: "workStreet" in dbperson ? dbperson.workStreet : undefined,
            doctorStreetNumber: "workBuildingNumber" in dbperson ? dbperson.workBuildingNumber : undefined,
            doctorCity: "workCity" in dbperson ? dbperson.workCity : undefined,
            doctorPostalCode: "workPostalCode" in dbperson ? dbperson.workPostalCode : undefined,
            doctorCountry: "workCountry" in dbperson ? findCountryIndex(dbperson.workCountry) : undefined,
        };
    }

    let navigate = useNavigate();

    const user = useRecoilValue(userAtom)
    if (!isEdit && user.id != null) {
        navigate("/")
    }

    const {data, error} = useSWR(isEdit ? ['http://localhost:4000/personal-info', user.token] : null, fetcherWithToken);
    let defaultValues = {};
    if (isEdit) {
        if (error) console.log(error.message);
        if (!data) return <div>Loading...</div>;
        if (data) console.log(data);
        defaultValues = getDefaultValues();
    }

    const storePatient = async (formData: IFormPerson, isEdit: boolean) => {
        const patient: IDatPatientProfile = {
            firstname: formData.name,
            surname: formData.surname,
            degree: formData.degree,
            birthdate: formData.birthdate,
            street: formData.street,
            buildingNumber: formData.streetNumber,
            city: formData.city,
            postalCode: parseInt(formData.postalCode),
            country: findCountryName(formData.country),
            email: formData.email,
            phonePrefix: findPhoneCodeName(formData.phoneCode).toString(),
            phone: parseInt(formData.phone),
            insuranceNumber: formData.insuranceNumber === undefined ? undefined : parseInt(formData.insuranceNumber),
            password1: formData.newPassword === undefined ? undefined : formData.newPassword,
            password2: formData.passwordCheck === undefined ? undefined : formData.passwordCheck
        }
        if (isEdit) {
            // TODO: edit url
            await updateProfile('http://localhost:4000/personal-info', patient, navigate);
        } else {
            await completeRegistration('http://localhost:4000/register', patient, navigate);
        }

    };

    // TODO: check storing address doctor attributes when API impl finished
    const storeDoctor = async (formData: IFormPerson, isEdit: boolean) => {
        const doctor: IDatDoctorProfile = {
            firstname: formData.name,
            surname: formData.surname,
            degree: formData.degree,
            birthdate: formData.birthdate,
            street: formData.street,
            buildingNumber: formData.streetNumber,
            city: formData.city,
            postalCode: parseInt(formData.postalCode),
            country: findCountryName(formData.country),
            email: formData.email,
            phonePrefix: findPhoneCodeName(formData.phoneCode).toString(),
            phone: parseInt(formData.phone),
            insuranceNumber: formData.insuranceNumber === undefined ? undefined : parseInt(formData.insuranceNumber),
            password1: formData.newPassword === undefined ? undefined : formData.newPassword,
            password2: formData.passwordCheck === undefined ? undefined : formData.passwordCheck,
            specialization: formData.specialization === undefined ? " TYPE ERROR" : findSpecializationName(formData.specialization),
            actuality: formData.status === undefined ? " TYPE ERROR" : formData.status,
            workStreet: formData.doctorStreet === undefined ? " TYPE ERROR" : formData.doctorStreet,
            workBuildingNumber: formData.doctorStreetNumber === undefined ? " TYPE ERROR" : formData.doctorStreetNumber,
            workCity: formData.doctorCity === undefined ? " TYPE ERROR" : formData.doctorCity,
            workPostalCode: formData.doctorPostalCode === undefined ? -1 : parseInt(formData.doctorPostalCode),
            workCountry: formData.doctorCountry === undefined ? " TYPE ERROR" : findCountryName(formData.doctorCountry),
        }
        if (isEdit) {
            // TODO: edit url
            await updateProfile('http://localhost:4000/personal-info', doctor, navigate);
        } else {
            await completeRegistration('http://localhost:4000/signup-doctor', doctor, navigate);
        }
    };

    // @ts-ignore
    const onSubmit = (formData: IFormPerson) => {
        console.log("NAME:" + formData.name)
        console.log(formData)
        switch (type) {
            case DataFormType.Patient:
                storePatient(formData, isEdit);
                break;
            case DataFormType.Doctor:
                storeDoctor(formData, isEdit);
                break;
            default:
                // TODO: change to reservation based on logged information
                storePatient(formData, isEdit);
                break;
        }
    }

    let copiedCountries = COUNTRIES.map((country) => country.label)
    const countryOptions = copiedCountries.map((country, index) => {
        return {
            "id": index + 1,
            "title": country
        }
    })
    const phoneOptions = COUNTRIES.map((country, index) => {
        return {
            "id": index + 1,
            "title": country.label + ": +" + country.phone
        }
    })

    const specializationOptions = SPECIALIZATIONS.map((spec, index) => {
        return {
            "id": index + 1,
            "title": spec
        }
    })

    const Input = styled('input')({
        display: 'none',
    });

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
                        defaultValues={isEdit ? defaultValues : null}
                        onSuccess={onSubmit}>
                        <Grid container spacing={2} alignItems="center" justifyContent={"center"}
                              marginLeft={{md: "auto"}}
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
                                               fullWidth/>
                            </Grid>
                            <Grid item xs={6}>
                                <FormTextField isEdit={isEdit} name={'postalCode'} label={'PSČ'}
                                               required={type != DataFormType.Reservation}
                                               fullWidth
                                               type={"number"}/>
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
                                <FormTextField isEdit={isEdit} name={'email'} label={'Email'} type={'email'}
                                               required={type != DataFormType.Reservation}
                                               fullWidth/>
                            </Grid>
                            <Grid item xs={12}>
                                <FormSelect isEdit={isEdit} name={'phoneCode'} label={'Předvolba'}
                                            required={type != DataFormType.Reservation} fullWidth
                                            options={phoneOptions}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormTextField isEdit={isEdit} name={'phone'} label={'Telefon'}
                                               required={type != DataFormType.Reservation} fullWidth
                                               type={"number"}/>
                            </Grid>
                            <Grid item xs={12}>
                                <FormTextField isEdit={isEdit} name={'insuranceNumber'} label={'Číslo pojišťovny'}
                                               type={"number"}/>
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
                                        <FormTextField isEdit={isEdit} name={'doctorStreet'} label={'Ulice'} fullWidth
                                                       />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <FormTextField isEdit={isEdit} name={'doctorStreetNumber'}
                                                       label={'Číslo popisné'} required
                                                       fullWidth/>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <FormTextField isEdit={isEdit} name={'doctorPostalCode'} label={'PSČ'}
                                                       fullWidth required
                                                       type={"number"}/>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormTextField isEdit={isEdit} name={'doctorCity'} label={'Město'}
                                                       fullWidth required/>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormSelect isEdit={isEdit} name={'doctorCountry'} label={'Stát'}
                                                    fullWidth required
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
                                            >{"Uložit změny"}</Button>
                                            <Button variant='contained' color={'primary'}
                                            >{"Zrušit změny"}</Button>
                                        </>
                                        : <Button variant='contained' type={'submit'} color={'primary'}
                                        >{"Registrovat se"}</Button>}
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


