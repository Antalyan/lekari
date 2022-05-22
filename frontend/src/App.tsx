import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';
import {ThemeProvider} from "@mui/material";

import {createTheme, responsiveFontSizes} from '@mui/material/styles';
import {MainPage} from './components/MainPage/MainPage';

import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {RegisterForm} from "./components/Forms/RegisterForm";
import {DoctorDetailPage} from "./components/DoctorDetail/DoctorDetailPage";
import {DataFormType} from "./data/Constants";
import {useRecoilValue} from "recoil";
import {userAtom} from "./state/LoggedInAtom";
import {IGlobalProfileInfo} from "./components/Interfaces";

let theme = createTheme();
theme = responsiveFontSizes(theme);

function getProfileType(user: IGlobalProfileInfo): DataFormType {
    if (user == null) {
        return DataFormType.Invalid;
    }
    if (user.isDoctor) {
        return DataFormType.Doctor;
    }
    return DataFormType.Patient
}

export default function App() {
    const user = useRecoilValue(userAtom);

    return <ThemeProvider theme={theme}>
        <GlobalStyles styles={{ul: {margin: 0, padding: 0, listStyle: 'none'},}} />
        <CssBaseline/>
        <BrowserRouter>
            <Routes>
                {/*TODO: add my-reservations, patient-reservations*/}
                <Route path="/" element={<MainPage />}/>
                <Route path="/register-patient" element={<RegisterForm {...{type: DataFormType.Patient, isEdit: false}} />} />
                <Route path="/register-doctor" element={<RegisterForm {...{type: DataFormType.Doctor,  isEdit: false}} />} />
                <Route path="/doctor/:id/make-reservation" element={<RegisterForm {...{type: DataFormType.Reservation,  isEdit: false}} />} />
                <Route path="/my-profile" element={<RegisterForm {...{type: getProfileType(user),  isEdit: true}} />} />
                <Route path="/doctor/:id" element={<DoctorDetailPage />} />
            </Routes>
        </BrowserRouter>
    </ThemeProvider>
}
