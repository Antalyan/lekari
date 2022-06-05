import {Button, Grid, Stack, Typography} from "@mui/material";
import {useForm} from "react-hook-form";
import * as React from "react";
import {IFilter} from "../../utils/Interfaces";
import {AutoSelect} from "./AutoSelect";
import {cities, specializations} from "../../data/MockData";
import {IPanelSetter} from "./SearchPanel";
import {SPECIALIZATIONS} from "../../data/Specializations";

export function FilterMenu({filter, setFilter}: IPanelSetter) {
    const {handleSubmit, control} = useForm<IFilter>();
    const onSubmit = (data: IFilter) => {
        /*TODO Handle data: send to database and retrieve updated doctors */
        /*Doctors will probably need to be connected with MainPage via a state */
        console.log(data)

        setFilter({
            specialization: data.specialization,
            location: data.location,
            search: filter.search
        });
    }

    return (
        <>
            <Typography variant="h5" gutterBottom component="div" align={"center"}
                        bgcolor={"primary.main"} color={"common.white"}
                        padding={2}>
                Nastavení filtru
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={2} margin={2}>
                    <AutoSelect control={control} id="combo-box-spec" name="specialization" label="Specializace"
                                options={SPECIALIZATIONS}/>
                    <AutoSelect control={control} id="combo-box-location" name="location" label="Lokace"
                                options={cities}/>
                    <Grid container justifyContent="center">
                        <Button variant='contained' type={'submit'} color={'primary'} onSubmit={handleSubmit(onSubmit)}>
                            Nastavit
                        </Button>
                    </Grid>
                </Stack>
            </form>
        </>
    )
}


