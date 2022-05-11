import Typography from "@mui/material/Typography";
import * as React from "react";
import Header from "../MainPage/Header";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Profile from "../../images/mock_profile.jpg";
import {SearchBox} from "../MainPage/SearchBox";
import {IBasicDoctor} from "../Interfaces";
import {DoctorCard} from "./DoctorCard";
import {Footer} from "../MainPage/Footer";
import {doctors} from "../../data/MockData";
import {useParams} from 'react-router-dom';
import {Rating, Tab, Tabs} from "@mui/material";


interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`doctor-tabpanel-${index}`}
            aria-labelledby={`doctor-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `doctor-tab-${index}`,
        'aria-controls': `doctor-tabpanel-${index}`,
    };
}

export function DoctorDetailPage() {
    /*TODO: finish handles and values: are they needed? copies from doc*/
    const [value, setValue] = React.useState(0);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    // TODO: change doctors to API request
    const {id} = useParams();
    if (id === undefined) {
        return <>ERROR</>
    }
    const doctor = doctors.filter((doctor) => doctor.id == parseInt(id))[0];


    return <>
        <Header/>
        <DoctorCard detailed={true} doctor={doctor}/>
        {doctor.rating != undefined && <Rating name="doctor-rating" value={doctor.rating} precision={0.5} readOnly
                                               sx={{m: 1, color: "primary.main"}}/>}

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="doctor-detail-tabs" centered variant="fullWidth">
                <Tab label="INFO" {...a11yProps(0)} />
                <Tab label="OBJEDNÁNÍ" {...a11yProps(1)} />
                <Tab label="RECENZE" {...a11yProps(2)} />
            </Tabs>
            <TabPanel value={value} index={0}>
                INFO
            </TabPanel>
            <TabPanel value={value} index={1}>
                OBJEDNÁNÍ
            </TabPanel>
            <TabPanel value={value} index={2}>
                RECENZE
            </TabPanel>
        </Box>



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
