import {FormContainer, TextFieldElement} from "react-hook-form-mui";
import {Button, Grid} from "@mui/material";
import {useForm} from "react-hook-form";
import {useState} from "react";
import {ILogin} from "../Interfaces";

export function LoginForm () {
    const formContext = useForm<ILogin>({
        defaultValues: {
            email: "",
            password: ""
        }
    })
    const { handleSubmit } = formContext

    const onSubmit = handleSubmit((formData: ILogin) => {
        {/*TODO Handle data*/}
        console.log(formData)
    })
    return (
        // @ts-ignore
        <FormContainer
            formContext={formContext}
            handleSubmit={onSubmit}>
            <TextFieldElement name={'email'} label={'Email'} required type={'email'} sx={{m: 1}}/><br />
            <TextFieldElement name={'password'} label={'Heslo'} required type={'password'} sx={{m: 1}}/><br />
            <Grid container justifyContent="center">
                <Button variant='contained' type={'submit'} color={'primary'} onSubmit={onSubmit}>{"Přihlásit se"}</Button>
            </Grid>
        </FormContainer>
    )
}


