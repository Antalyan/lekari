import * as React from "react";
import {useState} from "react";
import Grid from "@mui/material/Grid";
import {IconButton, Stack} from "@mui/material";
import Button from "@mui/material/Button";
import EditIcon from '@mui/icons-material/Edit';
import {IEditable, IOpeningHour} from "../Interfaces";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {FormContainer, MultiSelectElement, TextFieldElement} from "react-hook-form-mui";
import {useForm} from "react-hook-form";
import {DAYS, LANGUAGES} from "../../data/Constants";

function Opening({editable}: IEditable) {
    const [editingState, setEditingState] = useState<IOpeningHour>({
        editable: false,
        texts: Array(7).fill(null),
    });

    const invertEditability = () => {
        return setEditingState({
            editable: !editingState.editable,
            texts: editingState.texts
        })
    };

    const updateValue = (index: number, new_value: any) => {
        console.log("AAAAA")
        console.log(new_value);
        return setEditingState({
            editable: editingState.editable,
            texts: editingState.texts.map((val, ind) => {
                return index == ind ? new_value : val
            })
        })
    };

    return (<>
            <Box>
                <Typography
                    variant="subtitle1"
                    color={"primary.main"}
                    display="inline"
                > Otevírací doba
                </Typography>
                {/*TODO: type: do we really want it to submit?*/}
                {/*type={!editingState.editable ? "submit" : undefined}*/}
                {editable && <IconButton onClick={() => invertEditability()}>
                    <EditIcon/>
                </IconButton>}
            </Box>
            <Stack spacing={editingState.editable ? 2 : 0}>
                {DAYS.map((day, index) => {
                    return <Stack direction={"row"} spacing={2} key={index}>
                        <Typography width={60} display="inline">{day + ":"}</Typography>
                        {editingState.editable ?
                            <TextFieldElement name={"opening" + index} size="small" value={editingState.texts[index]}
                                              // onChange={(e) => updateValue(index, e.target.value)}
                                onChange={(e) => console.log("íííííííííí")}
                            /> :
                            <Typography display="inline">{editingState.texts[index]}</Typography>}
                    </Stack>
                })}
            </Stack>
        </>
    )
}

function Contact({editable}: IEditable) {
    const [editingState, setEditingState] = useState(false);
    return (
        <>
            <Box>
                <Typography
                    variant="subtitle1"
                    color={"primary.main"}
                    display="inline"
                > Kontakt
                </Typography>
                {editable && <IconButton onClick={() => setEditingState(!editingState)}
                                         type={!editingState ? "submit" : undefined}>
                    <EditIcon/>
                </IconButton>}
            </Box>
            <Stack spacing={editingState ? 2 : 0}>
                {/*TODO: add validation and potentially refactor to one*/}
                <Stack direction={"row"} spacing={2}>
                    <Typography width={40} display="inline">Email:</Typography>
                    {editingState ? <TextFieldElement name={"email"} type="email" size="small" value={"TEXT FIELD"}/> :
                        <Typography display="inline">LABEL</Typography>}
                </Stack>
                <Stack direction={"row"} spacing={2}>
                    <Typography width={40} display="inline">Tel:</Typography>
                    {editingState ? <TextFieldElement name={"phone"} size="small" value={"TEXT FIELD"}/> :
                        <Typography display="inline">LABEL</Typography>}
                </Stack>
                <Stack direction={"row"} spacing={2}>
                    <Typography width={40} display="inline">Web:</Typography>
                    {editingState ? <TextFieldElement name={"web"} size="small" value={"TEXT FIELD"}/> :
                        <Typography display="inline">LABEL</Typography>}
                </Stack>
            </Stack>
        </>)
}

function Languages({editable}: IEditable) {
    const [editingState, setEditingState] = useState(false);
    // TODO: change to languages type
    return (
        <>
            <Box>
                <Typography
                    variant="subtitle1"
                    color={"primary.main"}
                    display="inline"
                > Jazyky
                </Typography>
                {editable && <IconButton onClick={() => setEditingState(!editingState)}
                                         type={!editingState ? "submit" : undefined}>
                    <EditIcon/>
                </IconButton>}
            </Box>
            {
                editingState ?
                    <MultiSelectElement label="Jazyky" showCheckbox name="languages" menuItems={LANGUAGES}/> :
                    <Typography display="inline">LABEL</Typography>
            }
        </>
    )
}

function Description({editable}: IEditable) {
    const [editingState, setEditingState] = useState(false);
    // TODO: change to languages type
    return (
        <>
            <Box>
                <Typography
                    variant="subtitle1"
                    color={"primary.main"}
                    display="inline"
                > Popis
                </Typography>
                {editable && <IconButton onClick={() => setEditingState(!editingState)}
                                         type={!editingState ? "submit" : undefined}>
                    <EditIcon/>
                </IconButton>}
            </Box>
            {
                editingState ? <TextFieldElement name={"web"} size="small" value={"TEXT FIELD"} multiline/> :
                    <Typography display="inline">LABEL</Typography>
            }
        </>)
}

/*TODO: property *editable* depends on status (logged in/out) */
export function InfoPanel({editable}: IEditable) {
    const formContext = useForm<string[]>();
    const {handleSubmit} = formContext;
    const onSubmit = handleSubmit((formData: string[]) => {
        // TODO: send data to database on this click
        console.log(formData);
        console.log("XXX")
    });
    // @ts-ignore
    return (<FormContainer
        formContext={formContext}
        handleSubmit={onSubmit}>
        <Stack spacing={2}>
            <Opening editable={editable}/>
            <Contact editable={editable}/>
            <Languages editable={editable}/>
            <Description editable={editable}/>
            <Grid container>
                <Grid item xs={6}>
                    <Button variant='contained' type={'submit'} color={'primary'} onSubmit={onSubmit}>Uložit
                        změny</Button>
                </Grid>
                <Grid item xs={6}>
                    {/*TODO: change onSubmit to function resetting form (refresh page basically)*/}
                    <Button variant='contained' type={'submit'} color={'primary'} onClick={onSubmit}>Zrušit
                        změny</Button>
                </Grid>
            </Grid>
        </Stack>
    </FormContainer>)
}
