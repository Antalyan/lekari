import Typography from "@mui/material/Typography";
import * as React from "react";
import Header from "../Header";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Pills from "../../images/pills.jpg";
import {SearchPanel} from "./SearchPanel";
import {IBasicDoctor} from "../../Interfaces";
import {DoctorCard} from "../DoctorDetail/DoctorCard";
import {Footer} from "../Footer";
import {DOCTORS} from "../../data/MockData";

export function MainPage() {
    return <>
        <Header/>
        <Grid container rowSpacing={1} columnSpacing={{xs: 1, sm: 2, md: 3}}>
            {/*TODO: make img as background*/}
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
                     // TODO: adjust box color?
                    // bgcolor="lightgreen"
                     alignItems="right"
                     margin={1}
                     justifyContent="right">
                    <img src={Pills} alt='Pills' height="100%"/>
                </Box>
            </Grid>
            <Grid item xs={12}>
                <Typography sx={{m: 2}}
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
                <SearchPanel/>
            </Grid>
        </Grid>

        <Grid container rowSpacing={1} columnSpacing={{xs: 1, sm: 2, md: 3}} margin={1}>
            {/*TODO: get doctors from database using SWR? */}
            {DOCTORS.map((doctor: IBasicDoctor) => (
                <Grid item key={doctor.id} xs={12}>
                    <DoctorCard detailed={false} doctor={doctor}/>
                </Grid>
            ))}
        </Grid>
        <Footer/>
    </>
}
