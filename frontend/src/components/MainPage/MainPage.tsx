import Typography from "@mui/material/Typography";
import * as React from "react";
import Header from "../Header";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Pills from "../../images/pills.png";
import {SearchPanel} from "./SearchPanel";
import {IDoctorCard} from "../../utils/Interfaces";
import {DoctorCard} from "../DoctorDetail/DoctorCard";
import {Footer} from "../Footer";
import useSWR from 'swr';
import fetcher from "../../utils/fetcher";
import {IDatBasicDoctor} from "../../utils/DatabaseInterfaces";
import {useEffect, useState} from "react";
import {createTheme} from "@mui/material/styles";

export function MainPage() {
    const [dataFilter, setDataFilter] = useState<{specialization?: string, location?: string, search?: string}>({
        specialization: undefined,
        location: undefined,
        search: undefined
    });

    const [url, setUrl] = useState('http://localhost:4000/doctors');

    useEffect(() => {
        let tmpurl = 'http://localhost:4000/doctors'
        if (dataFilter.specialization != undefined || dataFilter.location != undefined || dataFilter.search != undefined) {
            tmpurl = tmpurl + "?";
        }
        if (dataFilter.specialization != undefined) {
            tmpurl = tmpurl + "specialization=" + dataFilter.specialization
        }
        if (dataFilter.location != undefined) {
            if (tmpurl.includes("=")) {
                tmpurl = tmpurl + "&"
            }
            tmpurl = tmpurl + "location=" + dataFilter.location
        }
        if (dataFilter.search != null) {
            if (tmpurl.includes("=")) {
                tmpurl = tmpurl + "&"
            }
            tmpurl = tmpurl + "surname=" + dataFilter.search
        }
        console.log(tmpurl);
        setUrl(tmpurl);
    }, [dataFilter])

    const { data, error } = useSWR(url, fetcher);
    if (error) console.log(error.message)
    if (!data) return <div>Loading...</div>;
    if (data) console.log(data)

    function convertDoctors() {
        return data.data.map((doctor: IDatBasicDoctor) => {
            return {
                id: doctor.id,
                name: (doctor.degree? doctor.degree + " " : "") + doctor.firstname + " " + doctor.surname,
                specialization: doctor.specialization,
                location: doctor.city,
                actuality: doctor.actuality,
            }
        });
    }

    let doctors: IDoctorCard[] = convertDoctors()
    const theme = createTheme();
    return <>
        <Header/>
        <Box
            sx={{
                minHeight: `calc(100vh - ${theme.spacing(20.7)})`,
            }}
        >
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
                    <SearchPanel filter={dataFilter} setFilter={setDataFilter}/>
                </Grid>
            </Grid>

            <Grid container rowSpacing={1} columnSpacing={{xs: 1, sm: 2, md: 3}} margin={1}>
                {doctors.map((doctor: IDoctorCard, index) => (
                    <Grid item key={index} xs={12}>
                        <DoctorCard detailed={false} doctor={doctor}/>
                    </Grid>
                ))}
            </Grid>
        </Box>
        <Footer/>
    </>
}
