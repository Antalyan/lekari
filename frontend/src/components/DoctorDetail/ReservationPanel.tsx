import * as React from "react";
import Grid from "@mui/material/Grid";
import {
    Divider,
    FormControlLabel,
    FormGroup,
    IconButton,
    Stack,
    Switch,
    TextareaAutosize,
    TextField
} from "@mui/material";
import Button from "@mui/material/Button";
import EditIcon from '@mui/icons-material/Edit';
import {IBasicDoctor, IContact, IEditable, IPatient} from "../../Interfaces";
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
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import {DAYS, LANGUAGES, RESERVATION_INTERVAL_BOUNDS} from "../../data/Constants";
import {INTERVALS, RESERVATION_TIMES} from "../../data/MockData";
import {useParams} from "react-router-dom";
import {useRecoilValue} from "recoil";
import {userAtom} from "../../state/LoggedInAtom";
import {isDate} from "util/types";

interface IReservationCreate {
    create: boolean
}

function getReservationTimes(date?: Date) {
    // TODO: replace with a database request
    return RESERVATION_TIMES
}

// interval | 60
function countIntervals(interval: number) {
    let result = [];
    let start = new Date(1971, 0, 1);
    start.setHours(RESERVATION_INTERVAL_BOUNDS[0]);
    while (start.getHours() < RESERVATION_INTERVAL_BOUNDS[1]) {
        result.push(start.getHours() + ":" + start.getMinutes() + (start.getMinutes() == 0 ? "0" : ""));
        start.setMinutes(start.getMinutes() + interval);

    }
    return result.map((val: string, index) => {
        return {id: index, title: val}
    });
}

//create: TRUE is for new reservation, FALSE for free slot cancelling
function ReservationDatePanel({create}: IReservationCreate) {
    const {id} = useParams();

    const formContext = useForm();
    const {handleSubmit} = formContext;

    const onSubmit = handleSubmit((formData: any) => {
        // TODO: change formData type to an interface
        // TODO: according to <create>, redirect to reservation form or store fake reservation (blocked timeslot by doctor)
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
                    > {create ? "Vytvoření nové rezervace" : "Zrušení rezervačního slotu"}
                    </Typography>
                    <DatePickerElement name={'reservationDate'} label={'Datum rezervace'} required
                        // @ts-ignore
                                       inputProps={{fullWidth: true}} onChange={(e) => setDateState(e)}/>
                    {dateState != null &&
                        <SelectElement name={'reservationTime'} label={'Čas rezervace'} required fullWidth
                                       options={getReservationTimes(dateState)}
                        />}
                    {create && dateState != null &&
                        <TextFieldElement name={"reservationNote"} label={"Poznámka pro lékaře"} size="small"
                                          multiline/>}
                    {/*TODO: change href for reservation creation or cancel based on <create> */}
                    {dateState != null &&
                        <Button variant='contained' type={'submit'} color={'primary'} onSubmit={onSubmit}>
                            {create ? "Vytvořit rezervaci" : "Zrušit rezervační slot"}
                        </Button>}
                </Stack>
            </FormContainer>
        </LocalizationProvider>
    </>
}

function ReservationSlots() {
    const formContext = useForm();
    const {handleSubmit} = formContext;
    const onSubmit = handleSubmit((formData: any) => {
        // TODO: add formData type to check type
        // TODO: store into database (check if not conflicting with reservations made on backend)
        // TODO: show result to the user
        console.log(formData)
    })

    const [daysState, setDaysState] = useState<boolean[]>([true, true, true, true, true, false, false]);
    const setArray = (index: number) => {
        // TODO: fix setter???
        return setDaysState(daysState.map((val, ind) => {
            return index == ind ? !val : val
        }))
    };

    const [intervalState, setIntervalState] = useState(INTERVALS[3]);

    const [fromDateState, setFromDateState] = useState<Date>();

    // @ts-ignore
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
                    > Nastavení rezervačních slotů
                    </Typography>
                    <Grid container>
                        <Grid item xs={6} container direction={"row"} paddingRight={2}>
                            <DatePickerElement name={'fromDate'} label={'Od'} required
                                               onAccept={(date) => {
                                                   date instanceof Date && setFromDateState(date)
                                               }}/>
                        </Grid>
                        <Grid item xs={6} container justifyContent={"right"} direction={"row"}>
                            <DatePickerElement name={'toDate'} label={'Do'} required minDate={fromDateState}/>
                        </Grid>
                    </Grid>
                    <FormGroup>
                        {DAYS.map((dayName, index) => {
                            return (<Grid container justifyContent={"space-between"} paddingBottom={2}>
                                <Grid item xs={4}>
                                    <FormControlLabel control={<Switch
                                        checked={daysState[index]}
                                        onClick={() => setArray(index)}
                                        inputProps={{'aria-label': 'controlled'}}
                                    />} label={DAYS[index]}/>
                                </Grid>
                                <Grid item xs={3}>
                                    <SelectElement name={'timeFrom' + index} label={'Od'} required={daysState[index]}
                                                   options={countIntervals(intervalState.title)} fullWidth={true}
                                                   size={"small"}
                                                   disabled={!daysState[index]}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <SelectElement name={'timeTo' + index} label={'Do'} required={daysState[index]}
                                                   options={countIntervals(intervalState.title)} fullWidth={true}
                                                   size={"small"}
                                                   disabled={!daysState[index]}
                                    />
                                </Grid>
                            </Grid>)
                        })}
                    </FormGroup>
                    <SelectElement name={'interval'} label={'Délka intervalu rezervací'} required
                                   options={INTERVALS} fullWidth={true} onChange={(index) => {
                        setIntervalState(INTERVALS[index])
                    }}/>
                    <Button variant='contained' type={'submit'} color={'primary'} onSubmit={onSubmit}>
                        {"Provést změnu"}
                    </Button>
                    <Divider/>
                </Stack>
            </FormContainer>
        </LocalizationProvider>
    </>
}

export function ReservationPanel() {
    const user = useRecoilValue(userAtom)
    const {id} = useParams();
    return <Stack spacing={4}>
        {user.id == id ?
            <>
                <ReservationSlots/>
                <ReservationDatePanel create={false}/>
            </> :
            <ReservationDatePanel create={true}/>}
    </Stack>
}
