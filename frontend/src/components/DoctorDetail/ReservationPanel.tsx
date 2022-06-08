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


function ReservationDatePanel() {
    const formContext = useForm<IReservationBasic>();
    const {handleSubmit} = formContext;
    const user = useRecoilValue(userAtom);

    // TODO check used slots are no longer available
    const sendReservation = async (formData: IReservationBasic) => {
        const reservation: IDatResCreate = {
            comment: formData.reservationNote,
            date: formData.reservationDate,
            time: formData.reservationTime
        };

        // note: data has to be in data part, headers in config part
        const url = `http://localhost:4000/doctor/${id}/reservations-registered`
        await axios.post(url, reservation,{
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
            .then(response => {
                console.log(response);
                alert("Rezervace vytvořena!")
                if (response.data.status === "success") {
                    window.location.reload();
                }
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
            navigate(`/doctor/${id}/make-reservation`, {
                state: {
                    reservationDate: formData.reservationDate,
                    reservationTime: formData.reservationTime,
                    reservationNote: formData.reservationNote
                }
            })
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
                    id: slot,
                    title: slot,
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

    // TODO: load value from user
    const [intervalState, setIntervalState] = useState(20);
    // interval | 60
    const countIntervals = () => {
        let result = [];
        let start = new Date(1971, 0, 1);
        start.setHours(RESERVATION_INTERVAL_BOUNDS[0]);
        while (start.getHours() < RESERVATION_INTERVAL_BOUNDS[1]) {
            result.push(start.getHours() + ":" + start.getMinutes() + (start.getMinutes() == 0 ? "0" : ""));
            start.setMinutes(start.getMinutes() + intervalState);
        }
        return result.map((val: string) => {
            return {id: val, title: val}
        });
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
                    > Nastavení rezervačních slotů
                    </Typography>
                    <Grid container justifyContent={"space-between"} paddingBottom={2}>
                        <Grid item xs={3}>
                            <DatePickerElement name={'fromDate'} label={'Od'} required/>
                        </Grid>
                        <Grid item xs={6}>
                            <SelectElement name={'interval'} label={'Délka intervalu rezervací'} required
                                           options={INTERVALS} fullWidth={true} onChange={(value) => {
                                setIntervalState(value)
                            }}/>
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
                                                   options={countIntervals()} fullWidth={true}
                                                   size={"small"}
                                                   disabled={!daysState[index]}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <SelectElement name={'timeTo' + index} label={'Do'} required={daysState[index]}
                                                   options={countIntervals()} fullWidth={true}
                                                   size={"small"}
                                                   disabled={!daysState[index]}
                                    />
                                </Grid>
                            </Grid>)
                        })}
                    </FormGroup>
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
