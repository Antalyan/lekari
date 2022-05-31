import Typography from "@mui/material/Typography";
import * as React from "react";
import Header from "../Header";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Profile from "../../images/mock_profile.jpg";
import {SearchPanel} from "../MainPage/SearchPanel";
import {IBasicDoctor} from "../../Interfaces";
import {DoctorCard} from "./DoctorCard";
import {Footer} from "../Footer";
import {DOCTORS} from "../../data/MockData";
import {useParams} from 'react-router-dom';
import {Rating, Tab, Tabs} from "@mui/material";
import {InfoPanel} from "./InfoPanel";
import {ReservationPanel} from "./ReservationPanel";
import {ReviewPanel} from "./ReviewPanel";
import {useRecoilValue} from "recoil";
import {userAtom} from "../../state/LoggedInAtom";


interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const {children, value, index, ...other} = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`doctor-tabpanel-${index}`}
            aria-labelledby={`doctor-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{p: 3}}>
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

    // TODO: return error or redirect if the user with this id does not exist
    const {id} = useParams();
    if (id === undefined) {
        // This should never happen in fact (redirecting elsewhere)
        return <>ERROR</>
    }

    // TODO: change doctors to API data request
    const doctor = DOCTORS.filter((doctor) => doctor.id == parseInt(id))[0];

    return <>
        <Header/>

        <Box width={"100vw"} marginLeft={{md: "auto"}}
             marginRight={{md: "auto"}}
             maxWidth={{md: 960}}>
            <DoctorCard detailed={true} doctor={doctor}/>
            <Box margin={{xs: 1, md:3}}>
                {doctor.rating != undefined && <Rating name="doctor-rating" value={doctor.rating} precision={0.5} readOnly
                                                       sx={{color: "primary.main"}}/>}
            </Box>


            <Box>
                <Tabs value={value} onChange={handleChange} aria-label="doctor-detail-tabs" centered variant="fullWidth">
                    <Tab label="INFO" {...a11yProps(0)} />
                    <Tab label="OBJEDNÁNÍ" {...a11yProps(1)} />
                    <Tab label="RECENZE" {...a11yProps(2)} />
                </Tabs>
                <TabPanel value={value} index={0}>
                    <InfoPanel/>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <ReservationPanel/>
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <ReviewPanel/>
                </TabPanel>
            </Box>
        </Box>

        <Footer/>
    </>
}
