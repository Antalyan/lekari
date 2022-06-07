import {IDoctorDetailInfo, IReview, IReviewList} from "../../utils/Interfaces";
import {Divider, Grid, Rating, Stack, Typography} from "@mui/material";
import * as React from "react";
import {FormContainer, TextFieldElement} from "react-hook-form-mui";
import {Controller, useForm} from "react-hook-form";
import Button from "@mui/material/Button";
import {useRecoilValue} from "recoil";
import {userAtom} from "../../state/LoggedInAtom";
import {useParams} from "react-router-dom";
import {IDatDoctorInfo, IDatReview} from "../../utils/DatabaseInterfaces";
import axios from "axios";
import {useState} from "react";

function ReviewCreate() {
    const formContext = useForm<IReview>();
    const {id} = useParams();

    const storeInfo = async (formData: IReview) => {
        const review: IDatReview = {
            author: formData.author,
            comment: formData.text,
            rate: rating == null ? undefined: rating
        }

        const url = `http://localhost:4000/doctors/${id}/review`
        await axios.post(url, review)
            .then(response => {
                console.log(response);
                if (response.data.status === "success") {
                    window.location.reload();
                }
            })
            .catch((error) => {
                console.error(error);
                alert("Zápis recenze selhal!\n\n" + error.response.data.message)
            });
    }

    const onSubmit = (formData: IReview) => {
        console.log(formData);
        storeInfo(formData);
    };

    const [rating, setRating] = useState<number | null>(null);

    return (<>
        {/*@ts-ignore*/}
        <FormContainer
            formContext={formContext}
            onSuccess={onSubmit}>
            <Stack spacing={3} marginLeft={1}>
                <Typography variant="h6"
                            color={"primary.main"}
                            display={"inline"}>
                    Nové hodnocení
                </Typography>
                <Rating precision={0.5}
                        sx={{color: "primary.main"}}
                        onChange={(_, value) => {
                            setRating(value);
                        }}
                />
                <TextFieldElement name={"author"} label={"Autor"} size="medium"/>
                <TextFieldElement name={"text"} label={"Text"} size="medium" multiline/>
                <Grid container justifyContent={"center"}><Button variant='contained' type={'submit'} color={'primary'}>
                    Odeslat recenzi
                </Button>
                </Grid>
            </Stack>
        </FormContainer>
    </>)
}

function ReviewCard({author, createDate, createTime, rating, text, id}: IReview) {
    return <>
        <Divider/>
        <Grid container justifyContent={"space-between"} spacing={1}>
            <Grid item xs={12}>
                <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                    <Typography variant="h6"
                                color={"primary.main"}
                                display={"inline"}>
                        {author}
                    </Typography>
                    <Typography variant="subtitle2"
                                color={"text.secondary"}
                                display={"inline"}>
                        {/*TODO: put under each other*/}
                        {createDate + ", " + createTime}
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

export function ReviewPanel({reviews}: IReviewList) {
    const user = useRecoilValue(userAtom)
    const {id} = useParams();
    return <Stack spacing={4}>
        {user.id != id  && <ReviewCreate/>}
        {reviews.map((review) => <ReviewCard {...review}/>)}
    </Stack>
}
