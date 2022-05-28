import {Control, Controller} from "react-hook-form";
import {Autocomplete, TextField} from "@mui/material";
import * as React from "react";
import {IBasicDoctor} from "../../Interfaces";

type AutoSelectProps = {
    control: Control<IBasicDoctor>,
    id: string,
    name: keyof IBasicDoctor,
    label: string,
    options: any[]
};

export function AutoSelect({control, id, name, label, options}: AutoSelectProps) {
    return (
        <Controller
            render={(props) => (
                <Autocomplete
                    {...props}
                    id={id}
                    options={options}
                    sx={{width: 200}}
                    renderInput={(params) => <TextField {...params}
                                                        name={name}
                                                        label={label}/>}
                    onChange={(_, data) => props.field.onChange(data)}/>
            )}
            name={name}
            control={control}
        />
    );
}
