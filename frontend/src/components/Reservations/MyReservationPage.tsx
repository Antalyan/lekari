import Typography from "@mui/material/Typography";
import * as React from "react";
import Grid from "@mui/material/Grid";
import {IReservation} from "../../utils/Interfaces";
import Header from "../Header";
import {Footer} from "../Footer";
import {ReservationCard} from "./ReservationCard";
import useSWR from "swr";
import {fetcherWithToken} from "../../utils/fetcher";
import {useRecoilValue} from "recoil";
import {userAtom} from "../../state/LoggedInAtom";
import {IDatDoctorReservation, IDatPersonReservation} from "../../utils/DatabaseInterfaces";

export function MyReservationPage(props: { isPatient: boolean }) {
    const user = useRecoilValue(userAtom)
    const url = props.isPatient ? 'http://localhost:4000/person-reservations' : 'http://localhost:4000/doctor-reservations';
    const {data, error} = useSWR( [url, user.token], fetcherWithToken);
    if (error) console.log(error.message)
    if (!data) return <div>Loading...</div>;
    if (data) console.log(data)

    const getAddress = (reservation: IDatPersonReservation): string => {
        if (reservation.workStreet != undefined) {
            return reservation.workStreet + " " + reservation.workBuildingNumber + ", " + reservation.workCity
        }
        return reservation.workCity + " " + reservation.workBuildingNumber
    }

    const reservations: IReservation[] = props.isPatient ?
        data.data.reservations.map((reservation: IDatPersonReservation): IReservation => {
            return {
                id: reservation.id,
                doctorName: (reservation.doctorDegree ? reservation.doctorDegree + " " : "")
                    + reservation.doctorFirstname + " " + reservation.doctorSurname,
                createDate: reservation.createDate,
                createTime: reservation.createTime,
                visitDate: reservation.visitDate,
                visitTimeFrom: reservation.visitTimeFrom,
                visitTimeTo: reservation.visitTimeTo,
                doctorAddress: getAddress(reservation),
                note: reservation.note
            }}) :
            data.data.reservations.map((reservation: IDatDoctorReservation): IReservation => {
                return {
                    id: reservation.id,
                    patientName: (reservation.personDegree ? reservation.personDegree + " " : "")
                        + reservation.personFirstname + " " + reservation.personSurname,
                    createDate: reservation.createDate,
                    createTime: reservation.createTime,
                    visitDate: reservation.visitDate,
                    visitTimeFrom: reservation.visitTimeFrom,
                    visitTimeTo: reservation.visitTimeTo,
                    note: reservation.note
                }});

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
            {reservations.map((reservation: IReservation) => (
                <Grid item key={reservation.id} xs={12}>
                    <ReservationCard isPatient={props.isPatient} reservation={reservation}/>
                </Grid>
            ))}
        </Grid>

        <Footer/>
    </>
}
