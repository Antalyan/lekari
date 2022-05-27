import {IEditable, IPatient, IReview} from "../Interfaces";
import {Divider, Grid, Rating, Stack, Typography} from "@mui/material";
import * as React from "react";
import {REVIEWS} from "../../data/MockData";
import {FormContainer, TextFieldElement} from "react-hook-form-mui";
import {useForm} from "react-hook-form";
import Button from "@mui/material/Button";
import {useRecoilValue} from "recoil";
import {userAtom} from "../../state/LoggedInAtom";
import {useParams} from "react-router-dom";

function ReviewCreate() {
    const formContext = useForm<IReview>()
    const {handleSubmit} = formContext

    const onSubmit = handleSubmit((formData: IReview) => {
        // TODO: add date, save to db
        console.log(formData)
    })

    return (<>
        {/*@ts-ignore*/}
        <FormContainer
            formContext={formContext}
            handleSubmit={onSubmit}>
            <Stack spacing={3} marginLeft={1}>
                <Typography variant="subtitle1"
                            color={"primary.main"}
                            display={"inline"}>
                    Nové hodnocení
                </Typography>
                <Rating name="rating" value={0} precision={0.5}
                        sx={{color: "primary.main"}}/>
                <TextFieldElement name={"name"} label={"Autor"} size="medium"/>
                <TextFieldElement name={"text"} label={"Text"} size="medium" multiline/>
                <Button variant='contained' type={'submit'} color={'primary'} onSubmit={onSubmit}>
                    Odeslat recenzi
                </Button>
            </Stack>
        </FormContainer>
    </>)
}

function ReviewCard({name, date, rating, text, id}: IReview) {
    return <>
        <Divider/>
        <Grid container justifyContent={"space-between"} spacing={1}>
            <Grid item xs={12}>
                <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                    <Typography variant="h6"
                                color={"primary.main"}
                                display={"inline"}>
                        {name}
                    </Typography>
                    <Typography variant="subtitle2"
                                color={"text.secondary"}
                                display={"inline"}>
                        {date.toDateString()}
                    </Typography>
                </Stack>
            </Grid>
            <Grid item xs={12}>
                <Rating name={"doctor-rating" + id} value={rating} precision={0.5} readOnly
                        sx={{color: "primary.main"}}/>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="subtitle1"
                            color={"body1"}
                            display={"inline"}>
                    {text}
                </Typography>
            </Grid>
        </Grid>
    </>
}

export function ReviewPanel() {
    const user = useRecoilValue(userAtom)
    const {id} = useParams();
    return <Stack spacing={4}>
        {user.id != id  && <ReviewCreate/>}
        {REVIEWS.map((review) => <ReviewCard {...review}/>)}
    </Stack>
}
