import * as React from "react";
import Grid from "@mui/material/Grid";
import {Stack} from "@mui/material";
import Button from "@mui/material/Button";
import {IBasicDoctor} from "../Interfaces";
import Typography from "@mui/material/Typography";
import {LocationOn, Person, Warning} from "@mui/icons-material";
import Box from "@mui/material/Box";
import Profile from "../../images/mock_profile.jpg";

export function DoctorCardLabels(props: { detailed: boolean, doctor: IBasicDoctor }) {
    return <Stack direction="column" spacing={2} padding={2}>
        {!props.detailed && <Typography>
            {props.doctor.name}
        </Typography>}
        <Stack direction="row" spacing={1}>
            <Person/>
            <Typography>
                {props.doctor.specialization}
            </Typography>
        </Stack>
        <Stack direction="row" spacing={1}>
            <LocationOn color={"secondary"}/>
            <Typography>
                {props.doctor.location}
            </Typography>
        </Stack>
        {props.doctor.actuality != "" && <Stack direction="row" spacing={1}>
            <Warning/>
            <Typography>
                {props.doctor.actuality}
            </Typography>
        </Stack>}
    </Stack>;
}

export function DoctorCard(props: { detailed: boolean, doctor: IBasicDoctor }) {
    return (
        // TODO change bgcolor
        <Grid container rowSpacing={1} columnSpacing={{xs: 1, sm: 2, md: 3}}>
            {props.detailed && <Grid item xs={12}>
                <Typography sx={{m: 2}}
                            variant="h3"
                            align="center"
                            color="text.primary"
                            gutterBottom
                            fontWeight="bold"
                > {props.doctor.name}
                </Typography>
            </Grid>}
            {props.detailed && <Grid item xs={4}>
                <Box display="flex" height="7rem"
                    // bgcolor="lightgreen"
                     alignItems="left"
                     marginTop={1}
                     justifyContent="left">
                    <img src={Profile} alt='Doctor Profile' height="100%"/>
                </Box>
            </Grid>}
            <Grid item xs={8}>
                <DoctorCardLabels {...props}/>
            </Grid>
            {!props.detailed &&
                <Grid item xs={4} container direction="column" paddingRight={4} justifyContent={"center"}
                      alignItems={"flex-end"}>
                    <Stack spacing={2}>
                        <Button href={`/doctor/${props.doctor.id}`} variant='contained' color={'primary'}
                                size={"medium"}
                                onClick={() => console.log("DETAIL")}>DETAIL</Button>
                        <Button variant='contained' color={'primary'} size={"medium"}>OBJEDNÁNÍ</Button>
                    </Stack>
                </Grid>}
        </Grid>
    )
}
