import Typography from "@mui/material/Typography";
import * as React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Pills from "../../images/pills.jpg";
import {IBasicDoctor, IReservation} from "../Interfaces";
import {DoctorCard} from "../DoctorDetail/DoctorCard";
import {DOCTORS, RESERVATIONS} from "../../data/MockData";
import Header from "../Header";
import {Footer} from "../Footer";
import {ReservationCard} from "./ReservationCard";

export function MyReservationPage(props: {isPatient: boolean}) {
    return <>
        <Header/>

        <Typography sx={{m: 2}}
                    component="h2"
                    variant="h3"
                    align="center"
                    color="text.primary"
                    gutterBottom
                    fontWeight="bold"
        >
            Moje rezervace
        </Typography>

        <Grid container rowSpacing={1} columnSpacing={{xs: 1, sm: 2, md: 3}} margin={1}>
            {/*TODO: check whether this is the correct index*/}
            {/*TODO: display one reservation of the currently logged person (database request)*/}
            {/*TODO: order by date*/}
            {/*TODO: show only reservations that did not happen yet*/}
            {RESERVATIONS.map((reservation: IReservation) => (
                <Grid item key={reservation.id} xs={12}>
                    <ReservationCard isPatient={props.isPatient} reservation={reservation}/>
                </Grid>
            ))}
        </Grid>
        <Footer/>
    </>
}
