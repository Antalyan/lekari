import {useForm} from "react-hook-form";
import {FormContainer, TextFieldElement} from "react-hook-form-mui";
import {Box, IconButton} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import * as React from "react";
import {useState} from "react";
import {FilterList} from "@mui/icons-material";
import Menu from "@mui/material/Menu";
import {FilterMenu} from "./FilterMenu";

export interface IPanelSetter {
    filter: {specialization?: string, location?: string, search?: string};
    setFilter: React.Dispatch<React.SetStateAction<{specialization?: string, location?: string, search?: string}>>
}

export function SearchPanel({filter, setFilter}: IPanelSetter) {
    const formContext = useForm<{ search: string }>({
        defaultValues: {
            search: '',
        }
    })
    const {handleSubmit} = formContext

    const onSubmit = handleSubmit((formData: { search: string }) => {
        /*TODO Handle data: send to database and retrieve updated doctors */
        /*Doctors will probably need to be connected with MainPage via a state */
        console.log(formData);

        setFilter({
            specialization: filter.specialization,
            location: filter.location,
            search: formData.search
        });
    })

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        // @ts-ignore
        <FormContainer
            formContext={formContext}
            handleSubmit={onSubmit} >
            <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} marginLeft={{md: "auto"}} marginRight={{md: "auto"}} maxWidth={{md: 960}}>
                <TextFieldElement name={'search'}
                                  variant="outlined"
                                  placeholder="VYHLEDAT LÉKAŘE"
                                  size="small" sx={{marginLeft: 2, width: "80%"}}/>
                <IconButton type="submit" aria-label="search">
                    <SearchIcon sx={{fill: "blue", fontSize: "100%", padding: 0}}/>
                </IconButton>
                <IconButton
                    size="large"
                    aria-label="filter area"
                    aria-controls="menu-filter"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                >
                    <FilterList fontSize="medium"/>
                </IconButton>
                <Menu
                    id="menu-filter"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <FilterMenu filter={filter} setFilter={setFilter}/>
                </Menu>
            </Box>
        </FormContainer>
    )
}
