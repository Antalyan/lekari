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
                            isDoctor: response.data.user.id,
                            token: response.data.token
                        })
                    }
                }
            )
            .catch((error) => {
                console.error(error);
                alert("Přihlášení selhalo!\n\n")
            });
        let logged_user = null;
        switch (formData.password) {
            case "1":
                logged_user = DOCTORS[0];
                break;
            case "2":
                logged_user = DOCTORS[1];
                break;
            case "3":
                logged_user = DOCTORS[2];
                break;
            case "4": // not a doctor
                logged_user = REVIEWS[0];
                break;
        }
        if (logged_user == null) {
            // TODO: show pop-up window with incorrect password
            console.log(logged_user)
        } else {

        }

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


