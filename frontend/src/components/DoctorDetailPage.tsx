import Typography from "@mui/material/Typography";
import * as React from "react";
import Header from "./Header";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Profile from "../images/mock_profile.jpg";
import {SearchBox} from "./SearchBox";
import {IBasicDoctor} from "./Interfaces";
import {DoctorCard} from "./DoctorCard";
import {Footer} from "./Footer";
import {doctors} from "../data/MockData";
import {useParams} from 'react-router-dom';


export function DoctorDetailPage() {
    // TODO: change doctors to API request
    const {id} = useParams();
    if (id === undefined) {
        return <>ERROR</>
    }
    const doctor = doctors.filter((doctor) => doctor.id == parseInt(id))[0];
    return <>
        <Header/>
        <DoctorCard detailed={true} doctor={doctor}/>
        {/*<Grid container rowSpacing={1} columnSpacing={{xs: 1, sm: 2, md: 3}}>*/}
        {/*    <Grid item xs={4}>*/}
        {/*        <Typography sx={{m: 2}}*/}
        {/*                    component="h2"*/}
        {/*                    variant="h3"*/}
        {/*                    align="left"*/}
        {/*                    color="text.primary"*/}
        {/*                    gutterBottom*/}
        {/*                    fontWeight="bold"*/}
        {/*        >*/}
        {/*            Hledáte<Box color="primary.main">nejlepšího<br/>lékaře?</Box>*/}
        {/*        </Typography>*/}
        {/*    </Grid>*/}
        {/*    <Grid item xs={8}>*/}
        {/*        <Box display="flex" height="20rem"*/}
        {/*            // bgcolor="lightgreen"*/}
        {/*             alignItems="right"*/}
        {/*             margin={1}*/}
        {/*             justifyContent="right">*/}
        {/*            <img src={Pills} alt='Pills' height="100%"/>*/}
        {/*        </Box>*/}
        {/*    </Grid>*/}
        {/*    <Grid item xs={12}>*/}
        {/*        <Typography sx={{m: 2}}*/}
        {/*            // component="body"*/}
        {/*            // variant="body1"*/}
        {/*                    align="left"*/}
        {/*                    color="text.secondary"*/}
        {/*                    gutterBottom*/}
        {/*        >*/}
        {/*            Využijte portál <strong><Box display="inline" color="primary.main">Luďkovi lékaři </Box></strong>*/}
        {/*            k nalezení nejlepšího lékaře na Váš problém a rovnou se k němu objednejte!*/}
        {/*        </Typography>*/}
        {/*    </Grid>*/}
        {/*    <Grid item xs={12}>*/}
        {/*        <Typography sx={{m: 2}}*/}
        {/*                    component="h2"*/}
        {/*                    variant="h3"*/}
        {/*                    align="center"*/}
        {/*                    color="text.primary"*/}
        {/*                    gutterBottom*/}
        {/*                    fontWeight="bold"*/}
        {/*        >*/}
        {/*            Seznam lékařů*/}
        {/*        </Typography>*/}
        {/*    </Grid>*/}
        {/*</Grid>*/}
        {/*<Grid container rowSpacing={1} columnSpacing={{xs: 1, sm: 2, md: 3}}>*/}
        {/*    <Grid item xs={12}>*/}
        {/*        <SearchBox/>*/}
        {/*    </Grid>*/}
        {/*</Grid>*/}

        {/*<Grid container rowSpacing={1} columnSpacing={{xs: 1, sm: 2, md: 3}} margin={1}>*/}
        {/*    {doctors.map((doctor: IBasicDoctor) => (*/}
        {/*        <Grid item key={doctor.name} xs={12}>*/}
        {/*            <DoctorCard {...doctor}/>*/}
        {/*        </Grid>*/}
        {/*    ))}*/}
        {/*</Grid>*/}
        <Footer/>
    </>
}
