import * as React from "react";
import Grid from "@mui/material/Grid";
import {Divider, Stack} from "@mui/material";
import Button from "@mui/material/Button";
import {IBasicDoctor, IReservation} from "../../Interfaces";
import Typography from "@mui/material/Typography";
import {LocationOn, Person, Warning} from "@mui/icons-material";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Box from "@mui/material/Box";
import Profile from "../../images/mock_profile.jpg";

export function ReservationCardLabels(props: { isPatient: boolean, reservation: IReservation }) {
    return <Stack direction="column" spacing={2} padding={2}>
        <Grid item xs={12}>
            <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                <Typography variant="h5"
                            color={"primary.main"}
                            display={"inline"}
                            fontWeight={"bold"}
                >
                    {props.isPatient ? props.reservation.doctorName : props.reservation.patientName}
                </Typography>
                <Typography variant="subtitle2"
                            color={"text.secondary"}
                            display={"inline"}>
                    {/*TODO: fix date format*/}
                    {props.reservation.creationAt.toDateString()}
                </Typography>
            </Stack>
        </Grid>
        <Stack direction="row" spacing={1}>
            <AccessTimeIcon color={"info"}/>
            <Typography>
                {/*TODO: fix date format*/}
                {props.reservation.visitDate.toDateString()}
            </Typography>
        </Stack>
        {props.isPatient && <Stack direction="row" spacing={1}>
            <LocationOn color={"info"}/>
            <Typography>
                {props.reservation.address}
            </Typography>
        </Stack>}
        {props.reservation.note != null && <Stack direction="row" spacing={1}>
            <InfoOutlinedIcon color={"primary"}/>
            <Typography color={"primary"}>
                {props.reservation.note}
            </Typography>
        </Stack>}
    </Stack>;
}

function deleteReservation (isPatient: boolean, reservation: IReservation): void {
    // TODO: delete reservation from database AND update GUI (perhaps automatically using SWR?)
}

export function ReservationCard(props: { isPatient: boolean, reservation: IReservation }) {

    return (
        // TODO change bgcolor
        <Grid container rowSpacing={1} columnSpacing={{xs: 1, sm: 2, md: 3}}>
            <Grid item xs={12}>
                <Divider/>
            </Grid>
            <Grid item xs={12}>
                <ReservationCardLabels {...props}/>
            </Grid>
            <Grid item xs={12} container direction="column" paddingRight={4} paddingBottom={2} justifyContent={"center"}
                  alignItems={"flex-end"}>
                <Button href={`/doctor/${props.reservation.id}`} variant='contained' color={'primary'}
                        size={"medium"}
                        onClick={() => deleteReservation (props.isPatient, props.reservation)}>ZRUŠIT</Button>
            </Grid>
        </Grid>
    )
}

