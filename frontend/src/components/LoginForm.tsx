import {FormContainer, TextFieldElement} from "react-hook-form-mui";
import {Button, Grid} from "@mui/material";
import {useForm} from "react-hook-form";
import {useState} from "react";
import {ILogin} from "./Interfaces";

export function LoginForm () {
    const formContext = useForm<ILogin>({
        defaultValues: {
            email: "",
            password: ""
        }
    })
    const { handleSubmit } = formContext

    const [tmpState, setTmpState] = useState<ILogin>();
    const onSubmit = handleSubmit((formData: any) => {
        {/*TODO Handle data*/}
        setTmpState(formData)
    })
    return (
        // @ts-ignore
        <FormContainer
            formContext={formContext}
            handleSubmit={onSubmit}>
            <TextFieldElement name={'email'} label={'Email'} required type={'email'} sx={{m: 1}}/><br />
            <TextFieldElement name={'password'} label={'Heslo'} required type={'password'} sx={{m: 1}}/><br />
            <Grid container justifyContent="center">
                <Button variant='contained' type={'submit'} color={'primary'} onSubmit={onSubmit}>{"Přihlásit se" + tmpState?.password + tmpState?.email}</Button>
            </Grid>
        </FormContainer>
    )
}


