// TODO: evaluate isEdit (T: edit, F: initial fill in) based on which page we are (register + reservation vs profile)
import * as React from "react";
import {useState} from "react";
import {IconButton, Stack} from "@mui/material";
import {DatePickerElement, SelectElement, TextFieldElement} from "react-hook-form-mui";
import EditIcon from "@mui/icons-material/Edit";
import {IFormFieldProps} from "./RegisterForm";

export function FormTextField({
                                  isEdit,
                                  name,
                                  label = "",
                                  required = false,
                                  fullWidth = false,
                                  validation,
                                  type
                              }: IFormFieldProps) {
    const [editingState, setEditingState] = useState(false);
    if (isEdit) {
        return <TextFieldElement name={name} label={label} required={required} fullWidth={fullWidth}
                                 validation={validation}
                                 type={type}
                                 disabled={!editingState} variant={editingState ? "outlined" : "standard"}
                                 InputProps={{
                                     endAdornment:
                                         <IconButton onClick={() => setEditingState(!editingState)}>
                                             <EditIcon/>
                                         </IconButton>,
                                     disableUnderline: !editingState,
                                 }}/>
    }
    return <TextFieldElement name={name} label={label} required={required} fullWidth={fullWidth}
                             validation={validation}/>
}

export function FormSelect({
                               isEdit,
                               name,
                               label = "",
                               required = false,
                               fullWidth = false,
                               options
                           }: IFormFieldProps) {
    const [editingState, setEditingState] = useState(false);
    if (isEdit) {
        return <SelectElement name={name} label={label} required={required} fullWidth={fullWidth}
                              options={options}
                              disabled={!editingState} variant={editingState ? "outlined" : "standard"}
                              InputProps={{
                                  endAdornment:
                                      <IconButton onClick={() => setEditingState(!editingState)}>
                                          <EditIcon/>
                                      </IconButton>,
                                  disableUnderline: !editingState,
                              }}/>
    }
    return <SelectElement name={name} label={label} required={required} fullWidth={fullWidth}
                          options={options}/>
}

export function FormDatePicker({
                                   isEdit,
                                   name,
                                   label = "",
                                   required = false,
                               }: IFormFieldProps) {
    const [editingState, setEditingState] = useState(false);
    if (isEdit) {
        return <Stack justifyItems={"space-between"} direction={"row"} alignItems={"center"} spacing={2}>
            <DatePickerElement name={name} label={label} required={required}
                               disabled={!editingState}
                               InputProps={{
                                   sx: {border: '1px white'},
                                   fullWidth: true
                               }}
            />
            <IconButton onClick={() => setEditingState(!editingState)}>
                <EditIcon/>
            </IconButton>
        </Stack>
    }
    return <DatePickerElement name={name} label={label} required={required}/>
}
