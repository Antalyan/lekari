import * as React from "react";
import {useEffect, useState} from "react";
import Grid from "@mui/material/Grid";
import {Divider, FormControlLabel, FormGroup, Stack, Switch} from "@mui/material";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {DatePickerElement, FormContainer, SelectElement, TextFieldElement} from "react-hook-form-mui";
import {useForm} from "react-hook-form";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import {DAYS, INTERVALS, RESERVATION_INTERVAL_BOUNDS} from "../../data/Constants";
import {useNavigate, useParams} from "react-router-dom";
import {useRecoilValue} from "recoil";
import {userAtom} from "../../state/LoggedInAtom";
import {IReservationBasic, IReservationSlots, ISelectItem} from "../../utils/Interfaces";
import useSWR from "swr";
import fetcher from "../../utils/fetcher";
import axios from "axios";
import {IDatResCreate} from "../../utils/DatabaseInterfaces";

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

function ReservationDatePanel() {
    const formContext = useForm<IReservationBasic>();
    const {handleSubmit} = formContext;
    const user = useRecoilValue(userAtom);

    // TODO check
    const sendReservation = async (formData: IReservationBasic) => {
        const reservation: IDatResCreate = {
            comment: formData.reservationNote,
            date: formData.reservationDate,
            slotIndex: formData.reservationTime
        };
        const url = `http://localhost4000/doctor/${id}/reservations-registered`
        await axios.post(url, {
            reservation,
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
            .then(response => {
                console.log(response);
            })
            .catch((error) => {
                console.error(error);
                alert("Rezervace selhala!\n\n" + error.response.data.message)
            });
    }

    const onSubmit = handleSubmit((formData: IReservationBasic) => {
        console.log(formData);
        if (user.token) {
            sendReservation(formData);
        } else {
            navigate(`/doctor/${id}/make-reservation`)
            // TODO: pass <formData>: https://reactnavigation.org/docs/params/
        }
    })

    const [dateState, setDateState] = useState();
    const {id} = useParams();
    const navigate = useNavigate();

    let reservationTimes: ISelectItem[] = [];
    const url = `http://localhost:4000/doctors/${id}/slots/${dateState}`;
    const {data, error} = useSWR(dateState == null ? null : url, fetcher);

    useEffect(() => {
        console.log(url);
    }, [dateState]);

    if (error) console.log(error.message);
    if (data) {
        console.log(data);
        if (data.status != "error") {
            const datSlots: string[] = data.data.slots;
            reservationTimes = datSlots.map((slot, index) => {
                return {
                    id: index,
                    title: parseInt(slot).toString(),
                }
            })
        }
    }


    return <>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            {/*@ts-ignore*/}
            <FormContainer
                formContext={formContext}
                handleSubmit={onSubmit}>
                <Stack spacing={4}>
                    <Typography
                        variant="h6"
                        color={"primary.main"}
                        display="inline"
                    > {"Vytvoření nové rezervace"}
                    </Typography>
                    <DatePickerElement name={'reservationDate'} label={'Datum rezervace'} required
                        // @ts-ignore
                                       inputProps={{fullWidth: true}} onChange={(e) => setDateState(e)}/>
                    {dateState != null &&
                        <SelectElement name={'reservationTime'} label={'Čas rezervace'} required fullWidth
                                       options={reservationTimes}
                        />}
                    {dateState != null &&
                        <TextFieldElement name={"reservationNote"} label={"Poznámka pro lékaře"} size="small"
                                          multiline/>}
                    {dateState != null && <Grid container justifyContent={"center"}>
                        <Button variant='contained' size={"large"} type={'submit'} color={'primary'}
                                onSubmit={onSubmit}>
                            {"Vytvořit rezervaci"}
                        </Button>
                    </Grid>}
                </Stack>
            </FormContainer>
        </LocalizationProvider>
    </>
}

function ReservationSlots() {
    const formContext = useForm<IReservationSlots>();
    const {handleSubmit} = formContext;
    const onSubmit = handleSubmit((formData: IReservationSlots) => {
        // TODO: store into database (check if not conflicting with reservations made on backend)
        // TODO: show result to the user
        console.log(formData)
    })

    const [daysState, setDaysState] = useState<boolean[]>([false, false, false, false, false, false, false]);
    const setArray = (index: number) => {
        return setDaysState(daysState.map((val, ind) => {
            return index == ind ? !val : val
        }))
    };

    const [intervalState, setIntervalState] = useState(INTERVALS[3]);
    const [fromDateState, setFromDateState] = useState<Date>();

    return <>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            {/*@ts-ignore*/}
            <FormContainer
                formContext={formContext}
                handleSubmit={onSubmit}>
                <Stack spacing={4}>
                    <Typography
                        variant="h6"
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
                                <Grid item xs={3}>
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
                    <Grid container justifyContent={"center"}>
                        <Button variant='contained' size={"large"} type={'submit'} color={'primary'}
                                onSubmit={onSubmit}>
                            {"Provést změnu"}
                        </Button>
                    </Grid>
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
            </> :
            <ReservationDatePanel/>}
    </Stack>
}
