import * as React from "react";
import Grid from "@mui/material/Grid";
import {Stack} from "@mui/material";
import Button from "@mui/material/Button";
import {IBasicDoctor} from "./Interfaces";
import {DoctorCardLabels} from "./DoctorCardLabels";

export function DoctorCard({name, specialization, location, actuality, id}: IBasicDoctor) {
    return (
        // TODO change bgcolor
        <Grid container rowSpacing={1} columnSpacing={{xs: 1, sm: 2, md: 3}}>
            <Grid item xs={8}>
                <DoctorCardLabels name={name} specialization={specialization} location={location}
                                  actuality={actuality} detailed={false}/>
            </Grid>
            <Grid item xs={4} container direction="column" paddingRight={4} justifyContent={"center"}
                  alignItems={"flex-end"}>
                <Stack spacing={2}>
                    <Button href={`/doctor/${id}`} variant='contained' color={'primary'} size={"medium"}
                            onClick={() => console.log("DETAIL")}>DETAIL</Button>
                    <Button variant='contained' color={'primary'} size={"medium"}>OBJEDNÁNÍ</Button>
                </Stack>
            </Grid>
        </Grid>
    )
}
