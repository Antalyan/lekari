import {FormContainer, TextFieldElement} from "react-hook-form-mui";
import {Button, Grid} from "@mui/material";
import {useForm} from "react-hook-form";
import {useState} from "react";
import {ILogin} from "../../utils/Interfaces";
import {useRecoilState} from "recoil";
import {userAtom} from "../../state/LoggedInAtom";
import {DOCTORS, REVIEWS} from "../../data/MockData";

export function LoginForm () {
    const formContext = useForm<ILogin>({
        defaultValues: {
            email: "",
            password: ""
        }
    })

    const [user, setUser] = useRecoilState(userAtom);

    const { handleSubmit } = formContext

    const onSubmit = handleSubmit((formData: ILogin) => {
        {/*TODO Handle data*/}
        console.log(formData)
        {/*TODO Replace with Database info about user retrieval*/}
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
        }
        else {
            // @ts-ignore
            setUser({id: logged_user.id, name: logged_user.name, isDoctor: logged_user.id <= 3});
        }

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


