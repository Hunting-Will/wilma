import { Box, Typography } from "@mui/material";
import { InfoContainer } from "../global-ui/InfoContainer";

export const Lobby = () =>
    <Box display="flex" justifyContent="space-around">
        <Box
            flexDirection="column"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
        >
            <InfoContainer>
                <Typography variant="h2" component="h2">
                    Waiting to start game
                </Typography>
            </InfoContainer>
        </Box>
    </Box>