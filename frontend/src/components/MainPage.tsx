import Typography from "@mui/material/Typography";
import * as React from "react";
import Header from "./Header";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Pills from "../images/pills.jpg";
import {SearchBox} from "./SearchBox";
import {IBasicDoctor} from "./Interfaces";
import {DoctorCard} from "./DoctorCard";

function Copyright(props: any) {
    return (
        <Typography variant="body2" align="center" color={"common.white"} {...props}>
            {'©'}
            {new Date().getFullYear()}
            {" Luďkovi lékaři, PB138"}
        </Typography>
    );
}

const doctors = [
    {
        "name": "MUDr. Adam Ananas",
        "specialization": "Neurolog",
        "location": "Brno",
        "actuality": "Jsem na dovolené"
    },
    {
        "name": "Beata Boubelatá",
        "specialization": "Kardiolog",
        "location": "Praha",
        "actuality": ""
    },
    {
        "name": "MVDr. Cecil Cukrový",
        "specialization": "Vlčí zvěrolékař",
        "location": "Nové Město na Moravě",
        "actuality": "Přijímám nové vlky! Dokud mě nesní..."
    }
]

export function MainPage() {
    return <>
        <Header/>
        <Grid container rowSpacing={1} columnSpacing={{xs: 1, sm: 2, md: 3}}>
            <Grid item xs={4}>
                <Typography sx={{m: 2}}
                            component="h2"
                            variant="h3"
                            align="left"
                            color="text.primary"
                            gutterBottom
                            fontWeight="bold"
                >
                    Hledáte<Box color="primary.main">nejlepšího<br/>lékaře?</Box>
                </Typography>
            </Grid>
            <Grid item xs={8}>
                <Box display="flex" height="20rem"
                    // bgcolor="lightgreen"
                     alignItems="right"
                     margin={1}
                     justifyContent="right">
                    <img src={Pills} alt='Pills' height="100%"/>
                </Box>
            </Grid>
            <Grid item xs={12}>
                <Typography sx={{m: 2}}
                    // component="body"
                    // variant="body1"
                            align="left"
                            color="text.secondary"
                            gutterBottom
                >
                    Využijte portál <strong><Box display="inline" color="primary.main">Luďkovi lékaři </Box></strong>
                    k nalezení nejlepšího lékaře na Váš problém a rovnou se k němu objednejte!
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography sx={{m: 2}}
                            component="h2"
                            variant="h3"
                            align="center"
                            color="text.primary"
                            gutterBottom
                            fontWeight="bold"
                >
                    Seznam lékařů
                </Typography>
            </Grid>
        </Grid>
        <Grid container rowSpacing={1} columnSpacing={{xs: 1, sm: 2, md: 3}}>
            <Grid item xs={12}>
                <SearchBox/>
            </Grid>
        </Grid>

        <Grid container rowSpacing={1} columnSpacing={{xs: 1, sm: 2, md: 3}} margin={1}>
            {doctors.map((doctor: IBasicDoctor) => (
                <Grid item key={doctor.name} xs={12}>
                    <DoctorCard {...doctor}/>
                </Grid>
            ))}
        </Grid>
        <Box
            bgcolor={"primary.main"}
            maxWidth="md"
            component="footer"
            sx={{
                borderTop: (theme) => `1px solid ${theme.palette.divider}`,
                mt: 2,
                py: [2, 2],
            }}
        >
            <Copyright/>
        </Box>
    </>
}
