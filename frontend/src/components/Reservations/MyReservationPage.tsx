import Typography from "@mui/material/Typography";
import * as React from "react";
import Grid from "@mui/material/Grid";
import {IReservation} from "../../utils/Interfaces";
import {RESERVATIONS} from "../../data/MockData";
import Header from "../Header";
import {Footer} from "../Footer";
import {ReservationCard} from "./ReservationCard";
import useSWR from "swr";
import {fetcherWithToken} from "../../utils/fetcher";
import {useRecoilValue} from "recoil";
import {userAtom} from "../../state/LoggedInAtom";

export function MyReservationPage(props: { isPatient: boolean }) {
    const user = useRecoilValue(userAtom)
    const {data, error} = useSWR( ['http://localhost:4000/person-reservations', user.token], fetcherWithToken);
    if (error) console.log(error.message)
    if (!data) return <div>Loading...</div>;
    if (data) console.log(data)

    // const reservations = data.data.map((reservation: IReservationBasic) => {
    //     return {
    //         // TODO: fix name and adjust interface correspondingly (currently nested)
    //         name: doctor.name,
    //         specialization: doctor.specialization,
    //         location: doctor.location,
    //         actuality: doctor.actuality,
    //     }
    // });

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
            {props.isPatient ? "Moje rezervace" : "Rezervace pacientů"}
        </Typography>

        <Grid container rowSpacing={1} columnSpacing={{xs: 1}} marginLeft={{md: "auto"}}
              marginRight={{md: "auto"}}
              maxWidth={{md: 960}}>
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
