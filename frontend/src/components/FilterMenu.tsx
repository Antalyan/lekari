import {Button, Grid, Stack, Typography} from "@mui/material";
import {useForm} from "react-hook-form";
import * as React from "react";
import {useState} from "react";
import {IBasicDoctor} from "./Interfaces";
import {AutoSelect} from "./AutoSelect";

function FilterForm() {

    const defaultValues: IBasicDoctor = {
        name: "",
        specialization: "",
        location: "",
        actuality: "",
        id: -1
    }
    const {handleSubmit, control} = useForm({defaultValues});
    const onSubmit = (data: IBasicDoctor) => {
        console.log(data)
    }

    return <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2} margin={2}>
            <AutoSelect control={control} id="combo-box-spec" name="specialization" label="Specializace"
                        options={specializations}/>
            <AutoSelect control={control} id="combo-box-location" name="location" label="Lokace" options={cities}/>
            <Grid container justifyContent="center">
                <Button variant='contained' type={'submit'} color={'primary'} onSubmit={handleSubmit(onSubmit)}>
                    Nastavit
                </Button>
            </Grid>
        </Stack>
    </form>
}

export function FilterMenu() {
    return (
        <>
            <Typography variant="h5" gutterBottom component="div" align={"center"}
                        bgcolor={"primary.main"} color={"common.white"}
                        padding={2}>
                Nastavení filtru
            </Typography>
            <FilterForm/>
        </>
    )
}

const specializations = ["Chirurg", "Praktik"];
const cities = ["Praha", "Brno", "Ostrava", "Žďár nad Sázavou"]


