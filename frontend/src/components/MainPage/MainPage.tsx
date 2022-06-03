import Typography from "@mui/material/Typography";
import * as React from "react";
import Header from "../Header";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Pills from "../../images/pills.png";
import {SearchPanel} from "./SearchPanel";
import {IBasicDoctor} from "../../utils/Interfaces";
import {DoctorCard} from "../DoctorDetail/DoctorCard";
import {Footer} from "../Footer";
import {DOCTORS} from "../../data/MockData";
import {Divider} from "@mui/material";
import useSWR from 'swr';
import fetcher from "../../utils/fetcher";

export interface DatabaseDoctor {
    name: string,
    specialization: string,
    location: string,
    actuality: string,
    profile_picture: string
}

export function MainPage() {
    const { data, error } = useSWR('http://localhost:4000/doctors', fetcher);
    if (error) console.log(error.message)
    if (!data) return <div>Loading...</div>;

    const doctors: IBasicDoctor[] = data.data.map((doctor: DatabaseDoctor) => {
        return {
            name: doctor.name,
            specialization: doctor.specialization,
            location: doctor.location,
            actuality: doctor.actuality,
        }
    });

    return <>
        <Header/>
        <Grid container rowSpacing={0} columnSpacing={{xs: 1}} marginLeft={{md: "auto"}}
              marginRight={{md: "auto"}} maxWidth={{md: 960}}>
            <Grid item xs={6} md={8}>
                <Box display={{xs: "block", md: "none"}}>
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
                </Box>
                <Box display={{xs: "none", md: "block"}}>
                    <Typography sx={{m: 2}}
                                component="h2"
                                variant="h3"
                                align="left"
                                color="text.primary"
                                gutterBottom
                                fontWeight="bold"
                    >
                        Hledáte<Box display="inline" color="primary.main"> nejlepšího lékaře?</Box>
                    </Typography>
                    <Typography sx={{m: 2}}
                                align="left"
                                paddingTop={2}
                                color="text.secondary"
                                gutterBottom
                    >
                        Využijte portál <strong><Box display="inline" color="primary.main">Luďkovi lékaři </Box></strong>
                        k nalezení nejlepšího lékaře na Váš problém a rovnou se k němu objednejte!
                    </Typography>
                </Box>
            </Grid>
            <Grid item xs={6} md={4}>
                <Box display="flex" height={{xs:"10rem", md:"13rem"}}
                    // TODO: adjust box color?
                    // bgcolor="lightgreen"
                     alignItems="right"
                     margin={0}
                     justifyContent="right">
                    <img src={Pills} alt='Pills' height="100%"/>
                </Box>
            </Grid>
            <Grid item xs={12}>
                <Box display={{xs: "block", md: "none"}}>
                <Typography sx={{m: 2}}
                            align="left"
                            color="text.secondary"
                            gutterBottom
                >
                    Využijte portál <strong><Box display="inline" color="primary.main">Luďkovi lékaři </Box></strong>
                    k nalezení nejlepšího lékaře na Váš problém a rovnou se k němu objednejte!
                </Typography>
                </Box>
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
            {doctors.map((doctor: IBasicDoctor, index) => (
                <Grid item key={index} xs={12}>
                    <DoctorCard detailed={false} doctor={doctor}/>
                </Grid>
            ))}
        </Grid>
        <Footer/>
    </>
}
