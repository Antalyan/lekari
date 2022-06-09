import {FormContainer, TextFieldElement} from "react-hook-form-mui";
import {Button, Grid} from "@mui/material";
import {useForm} from "react-hook-form";
import {useRecoilState} from "recoil";
import {userAtom} from "../../state/LoggedInAtom";
import axios from "axios";
import {checkStatusOK} from "../../utils/fetcher";

interface ILogin {
    email: string,
    password: string
}

export function LoginForm() {
    const formContext = useForm<ILogin>();

    const [user, setUser] = useRecoilState(userAtom);

    const {handleSubmit} = formContext

    const onSubmit = handleSubmit(async (formData: ILogin) => {
        await axios.post("http://localhost:4000/login", formData)
            .then(response => {
                    console.log(response);
                    if (checkStatusOK(response.status)) {
                        setUser({
                            id: response.data.user.id,
                            firstName: response.data.user.firstName,
                            surname: response.data.user.surname,
                            isDoctor: response.data.user.isDoctor,
                            token: response.data.user.token
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


