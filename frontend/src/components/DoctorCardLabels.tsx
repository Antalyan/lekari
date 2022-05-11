import {Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
import {LocationOn, Person, Warning} from "@mui/icons-material";
import * as React from "react";

export function DoctorCardLabels(props: { name: string, specialization: string, location: string, actuality: string,  detailed: boolean }) {
    return <Stack direction="column" spacing={2} padding={2}>
        <Typography>
            {props.name}
        </Typography>
        <Stack direction="row" spacing={1}>
            <Person/>
            <Typography>
                {props.specialization}
            </Typography>
        </Stack>
        <Stack direction="row" spacing={1}>
            <LocationOn color={"secondary"}/>
            <Typography>
                {props.location}
            </Typography>
        </Stack>
        {props.actuality != "" && <Stack direction="row" spacing={1}>
            <Warning/>
            <Typography>
                {props.actuality}
            </Typography>
        </Stack>}
    </Stack>;
}
