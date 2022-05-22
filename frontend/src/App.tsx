import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import GlobalStyles from '@mui/material/GlobalStyles';
import Container from '@mui/material/Container';
import {Icon, Stack, ThemeProvider} from "@mui/material";
import Header from "./components/MainPage/Header";

import {createTheme, responsiveFontSizes} from '@mui/material/styles';
import Pills from "./images/pills.jpg"
import {MainPage} from './components/MainPage/MainPage';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {RegisterForm} from "./components/Forms/RegisterForm";
import {DoctorDetailPage} from "./components/DoctorDetail/DoctorDetailPage";
import {DataFormType} from "./data/Constants";

let theme = createTheme();
theme = responsiveFontSizes(theme);

export default function App() {
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
                <Route path="/my-profile" element={<RegisterForm {...{type: DataFormType.Reservation,  isEdit: true}} />} />
                <Route path="/doctor/:id" element={<DoctorDetailPage />} />
            </Routes>
        </BrowserRouter>
    </ThemeProvider>
}
