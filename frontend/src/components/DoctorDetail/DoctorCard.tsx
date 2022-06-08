import * as React from "react";
import Grid from "@mui/material/Grid";
import {Stack} from "@mui/material";
import Button from "@mui/material/Button";
import {IDoctorCard} from "../../utils/Interfaces";
import Typography from "@mui/material/Typography";
import {LocationOn, Person, Warning} from "@mui/icons-material";
import Box from "@mui/material/Box";
import Profile from "../../images/mock_profile.jpg";

export function DoctorCardLabels(props: { detailed: boolean, doctor: IDoctorCard }) {
    return <Stack direction="column" spacing={2} padding={2}>
        {!props.detailed && <Typography
            variant="h5"
            fontWeight="bold">
            {props.doctor.name}
        </Typography>}
        <Stack direction="row" spacing={1}>
            <Person/>
            <Typography>
                {props.doctor.specialization}
            </Typography>
        </Stack>
        <Stack direction="row" spacing={1}>
            <LocationOn color={"primary"}/>
            <Typography>
                {props.doctor.location}
            </Typography>
        </Stack>
        {props.doctor.actuality != undefined && <Stack direction="row" spacing={1}>
            <Warning color={"warning"}/>
            <Typography>
                {props.doctor.actuality}
            </Typography>
        </Stack>}
    </Stack>;
}

export function DoctorCard(props: { detailed: boolean, doctor: IDoctorCard }) {
    return (
        // TODO change bgcolor if desired
        <Grid container rowSpacing={1}
              columnSpacing={{xs: 0}}
              marginLeft={{md: "auto"}}
              marginRight={{md: "auto"}}
              maxWidth={{md: 960}}>
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
            {props.detailed && <Grid item xs={3}>
                <Box display="flex"  height={{xs:"7rem", md: "11rem"}}
                    // bgcolor="lightgreen"
                     alignItems="left"
                     marginTop={1}
                     marginLeft={{xs: 2, md:0}}
                     justifyContent="left">
                    <img src={Profile} alt='Doctor Profile' height="100%"/>
                </Box>
            </Grid>}
            {!props.detailed && <Grid item md={2}>
                <Box display={{md: "flex", xs: "none"}} height={{xs:"7rem", md: "10rem"}}
                    // bgcolor="lightgreen"
                     alignItems="left"
                     marginTop={1}
                     justifyContent="left">
                    <img src={Profile} alt='Doctor Profile' height="100%"/>
                </Box>
            </Grid>}
            <Grid item xs={7} md={6}>
                <DoctorCardLabels {...props}/>
            </Grid>
            {!props.detailed &&
                <Grid item xs={4} container direction="column" paddingRight={4} justifyContent={"flex-start"}
                      alignItems={"flex-end"} marginTop={3}>
                    <Button href={`/doctor/${props.doctor.id}`} variant='contained' color={'primary'}
                            size={"large"}
                            onClick={() => console.log("DETAIL")}>DETAIL</Button>
                </Grid>}
        </Grid>
    )
}

