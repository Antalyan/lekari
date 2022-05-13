import * as React from "react";
import Grid from "@mui/material/Grid";
import {IconButton, Stack, TextareaAutosize, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import EditIcon from '@mui/icons-material/Edit';
import {IBasicDoctor, IContact, IPatient} from "../Interfaces";
import Typography from "@mui/material/Typography";
import {LocationOn, Person, Warning} from "@mui/icons-material";
import Box from "@mui/material/Box";
import Profile from "../../images/mock_profile.jpg";
import {useState} from "react";
import {
    DatePickerElement,
    FormContainer,
    MultiSelectElement,
    SelectElement,
    TextFieldElement
} from "react-hook-form-mui";
import {useForm} from "react-hook-form";
import {languages} from "../../data/MockData";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import LocalizationProvider from '@mui/lab/LocalizationProvider';

function getReservationTimes(date?: Date) {
    // TODO: replace with a database request
    return [{id: 1, title: "12:00"}, {id: 1, title: "12:30"}, {id: 1, title: "13:00"}, {id: 1, title: "13:45"},
        {id: 1, title: "14:00"}, {id: 1, title: "15:30"}, {id: 1, title: "16:00"}, {id: 1, title: "16:45"}]
}

export function ReservationPanel(editable: boolean) {
    const formContext = useForm();
    const {handleSubmit} = formContext;

    const onSubmit = handleSubmit((formData: any) => {
        console.log(formData)
    })

    const [dateState, setDateState] = useState();

    return <>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            {/*@ts-ignore*/}
            <FormContainer
                formContext={formContext}
                handleSubmit={onSubmit}>
                <Stack spacing={4}>
                    <Typography
                        variant="subtitle1"
                        color={"primary.main"}
                        display="inline"
                    > Vytvoření nové rezervace
                    </Typography>
                    <DatePickerElement name={'reservationDate'} label={'Datum rezervace'} required
                        // @ts-ignore
                                       inputProps={{fullWidth: true}} onChange={(e) => setDateState(e)}/>
                    {/*TODO: time options must be database requests, based on a selected day*/}
                    {dateState != null &&
                        <SelectElement name={'reservationTime'} label={'Čas rezervace'} required fullWidth
                                       options={getReservationTimes(dateState)}
                        />}
                    {dateState != null && <TextFieldElement name={"reservationNote"} label={"Poznámka pro lékaře"} size="small" multiline/>}
                    {dateState != null && <Button variant='contained' type={'submit'} color={'primary'} onSubmit={onSubmit}>
                        Vytvořit rezervaci
                    </Button>}
                </Stack>
            </FormContainer>
        </LocalizationProvider>
    </>
}
