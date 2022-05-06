import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import * as React from "react";
import Header from "./Header";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Pills from "../images/pills.jpg";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import {Divider, Icon, IconButton, Stack} from "@mui/material";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import {AccountCircle, LocationOn, Person, Search, Warning} from "@mui/icons-material";
import SearchIcon from '@mui/icons-material/Search';
import {TextFieldElement} from "react-hook-form-mui";
import {SearchBox} from "./SearchBox";
import {IBasicDoctor} from "./Interfaces";

export function DoctorCard({name, specialization, location, actuality}: IBasicDoctor) {
    return (
        // TODO change bgcolor
        <Grid container rowSpacing={1} columnSpacing={{xs: 1, sm: 2, md: 3}}>
            <Grid item xs={8}>
                <Stack direction="column" spacing={2} padding={2}>
                    <Typography>
                        {name}
                    </Typography>
                    <Stack direction="row" spacing={1}>
                        <Person/>
                        <Typography>
                            {specialization}
                        </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1}>
                        <LocationOn color={"secondary"}/>
                        <Typography>
                            {location}
                        </Typography>
                    </Stack>
                    {actuality != "" && <Stack direction="row" spacing={1}>
                        <Warning/>
                        <Typography>
                            {actuality}
                        </Typography>
                    </Stack>}
                </Stack>
            </Grid>
            <Grid item xs={4} container direction="column" paddingRight={4} justifyContent={"center"}
                  alignItems={"flex-end"}>
                <Stack spacing={2}>
                    <Button variant='contained' color={'primary'} size={"medium"} onClick={() => console.log("DETAIL")}>DETAIL</Button>
                    <Button variant='contained' color={'primary'} size={"medium"}>OBJEDNÁNÍ</Button>
                </Stack>
            </Grid>
        </Grid>
    )
}
