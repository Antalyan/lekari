import * as React from 'react';
import {Footer} from "./components/Footer";
import Header from "./components/Header";
import {Box, Typography} from "@mui/material";

export function NotFoundPage() {
    return <>
        <Header/>
        <Box height={"100vh"}>
            <Typography
                variant="h3" gutterBottom component="div" align={"center"}
                color={"text.primary"}
                padding={2}>
                Požadovaná stránka nenalezena! <br/> Zkuste se vrátit na hlavní stránku...
            </Typography>
        </Box>
        <Footer/>
    </>
}
