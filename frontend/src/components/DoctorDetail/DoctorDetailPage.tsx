import Typography from "@mui/material/Typography";
import * as React from "react";
import Header from "../Header";
import Box from "@mui/material/Box";
import {DoctorCard} from "./DoctorCard";
import {Footer} from "../Footer";
import {useNavigate, useParams} from 'react-router-dom';
import {Rating, Tab, Tabs} from "@mui/material";
import {InfoPanel} from "./InfoPanel";
import {ReservationPanel} from "./ReservationPanel";
import {ReviewPanel} from "./ReviewPanel";
import useSWR from "swr";
import fetcher from "../../utils/fetcher";
import {IDatDoctorDetail, IDatReview} from "../../utils/DatabaseInterfaces";
import {IDoctorCard, IDoctorDetailInfo, IReview} from "../../utils/Interfaces";
import {createTheme} from "@mui/material/styles";


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
    const [tabValues, setTabValues] = React.useState(0);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValues(newValue);
    };

    const {id} = useParams();
    let navigate = useNavigate();
    if (id === undefined) {
        navigate("/");
    }

    const url = 'http://localhost:4000/doctors/' + id;
    // TODO: return error or redirect if the user with this id does not exist
    const {data, error} = useSWR(url, fetcher);
    if (error) {
        console.log(error.message);
    }

    if (!data) return <div>Loading...</div>;
    if (data) console.log(data)

    const getAddress = (doctor: IDatDoctorDetail): string => {
        if (doctor.workStreet != undefined) {
            return doctor.workStreet + " " + doctor.workBuildingNumber + ", " + doctor.workCity
        }
        return doctor.workCity + " " + doctor.workBuildingNumber
    }

    const datDoctor: IDatDoctorDetail = data.data;

    const doctor: IDoctorCard = {
        actuality: datDoctor.actuality,
        id: parseInt(id as string),
        location: getAddress(datDoctor),
        name: (datDoctor.degree ? datDoctor.degree + " " : "") + datDoctor.firstname + " " + datDoctor.surname,
        rating: datDoctor.rateAverage,
        specialization: datDoctor.specialization
    }
    const info: IDoctorDetailInfo = {
        email: datDoctor.workEmail,
        phone: datDoctor.workPhone ? datDoctor.workPhone.toString() : undefined,
        web: datDoctor.link,
        languages: datDoctor.languages,
        description: datDoctor.description,
        openingHours0: datDoctor.openingHours[0],
        openingHours1: datDoctor.openingHours[1],
        openingHours2: datDoctor.openingHours[2],
        openingHours3: datDoctor.openingHours[3],
        openingHours4: datDoctor.openingHours[4],
        openingHours5: datDoctor.openingHours[5],
        openingHours6: datDoctor.openingHours[6],
    }
    const reviews: IReview[] = datDoctor.reviews.map((datReview: IDatReview) => {
        return {
            author: datReview.author,
            createDate: datReview.createDate,
            createTime: datReview.createTime,
            rating: datReview.rate,
            text: datReview.comment,
        }
    });
    const theme = createTheme();
    return <>
        <Header/>
        <Box
            sx={{
                minHeight: `calc(100vh - ${theme.spacing(19.7)})`,
            }}
        >
        <Box width={"100vw"} marginLeft={{md: "auto"}}
             marginRight={{md: "auto"}}
             maxWidth={{md: 960}}>
            <DoctorCard detailed={true} doctor={doctor}/>
            <Box margin={{xs: 1, md: 3}}>
                {doctor.rating != undefined &&
                    <Rating name="doctor-rating" value={doctor.rating} precision={0.5} readOnly
                            sx={{color: "primary.main"}}/>}
            </Box>

            <Box>
                <Tabs value={tabValues} onChange={handleChange} aria-label="doctor-detail-tabs" centered
                      variant="fullWidth">
                    <Tab label="INFO" {...a11yProps(0)} />
                    <Tab label="OBJEDNÁNÍ" {...a11yProps(1)} />
                    <Tab label="RECENZE" {...a11yProps(2)} />
                </Tabs>
                <TabPanel value={tabValues} index={0}>
                    <InfoPanel {...info}/>
                </TabPanel>
                <TabPanel value={tabValues} index={1}>
                    <ReservationPanel/>
                </TabPanel>
                <TabPanel value={tabValues} index={2}>
                    <ReviewPanel reviews={reviews}/>
                </TabPanel>
            </Box>
        </Box>
        </Box>
        <Footer/>
    </>
}
