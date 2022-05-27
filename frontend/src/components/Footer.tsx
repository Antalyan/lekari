import Typography from "@mui/material/Typography";
import * as React from "react";
import Box from "@mui/material/Box";

function Copyright(props: any) {
    return (
        <Typography variant="body2" align="center" color={"common.white"} {...props}>
            {'©'}
            {new Date().getFullYear()}
            {" Luďkovi lékaři, PB138"}
        </Typography>
    );
}

export function Footer() {
    return <Box
        bgcolor={"primary.main"}
        component="footer"
        sx={{
            borderTop: (theme) => `1px solid ${theme.palette.divider}`,
            mt: 2,
            py: [2, 2],
        }}
    >
        <Copyright/>
    </Box>;
}
