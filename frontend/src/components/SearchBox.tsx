import {useForm} from "react-hook-form";
import {FormContainer, TextFieldElement} from "react-hook-form-mui";
import {AppBar, Box, Button, Grid, IconButton, Toolbar, Typography} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import * as React from "react";
import {AccountCircle, FilterList} from "@mui/icons-material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {LoginForm} from "./LoginForm";
import {useState} from "react";
import {FilterMenu} from "./FilterMenu";
import Header from "./Header";

export function SearchBox() {
    const formContext = useForm<{ name: string }>({
        defaultValues: {
            name: '',
        }
    })
    const {handleSubmit} = formContext

    const [tmp, setTmpState] = useState(true);
    const onSubmit = handleSubmit((formData: any) => {
        {/*TODO Handle data*/
            setTmpState(formData)
        }
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
            handleSubmit={onSubmit}>
            <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
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
                    {/* //TODO add: onClick={handleClose} */}
                    <FilterMenu/>
                </Menu>
            </Box>
        </FormContainer>
    )
}
