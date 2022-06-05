import {FormContainer, TextFieldElement} from "react-hook-form-mui";
import {Button, Grid} from "@mui/material";
import {useForm} from "react-hook-form";
import {useState} from "react";
import {ILogin} from "../../utils/Interfaces";
import {useRecoilState} from "recoil";
import {userAtom} from "../../state/LoggedInAtom";
import {DOCTORS, REVIEWS} from "../../data/MockData";
import axios from "axios";
import {NavigateFunction} from "react-router-dom";

export function LoginForm() {
    const formContext = useForm<ILogin>();

    const [user, setUser] = useRecoilState(userAtom);

    const {handleSubmit} = formContext

    const onSubmit = handleSubmit(async (formData: ILogin) => {
        console.log(formData);
        await axios.post("http://localhost:4000/login", formData)
            .then(response => {
                    console.log(response);
                    // TODO: add image
                    if (response.status === 200) {
                        setUser({
                            id: response.data.user.id,
                            firstName: response.data.user.firstname,
                            surname: response.data.user.surname,
                            // TODO: set isDoctor
                            isDoctor: true,
                            token: response.data.token
                        })
                    }
                }
            )
            .catch((error) => {
                console.error(error);
                alert("Přihlášení selhalo!\n\n")
            });
    })
    return (
        // @ts-ignore
        <FormContainer
            formContext={formContext}
            handleSubmit={onSubmit}>
            <TextFieldElement name={'email'} label={'Email'} required type={'email'} sx={{m: 1}}/><br/>
            <TextFieldElement name={'password'} label={'Heslo'} required type={'password'} sx={{m: 1}}/><br/>
            <Grid container justifyContent="center">
                <Button variant='contained' type={'submit'} color={'primary'}
                        onSubmit={onSubmit}>{"Přihlásit se"}</Button>
            </Grid>
        </FormContainer>
    )
}


