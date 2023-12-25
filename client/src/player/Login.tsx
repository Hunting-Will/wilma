import Typography from "@mui/material/Typography";
import { InfoContainer } from "../global-ui/InfoContainer";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

export function Login() {
  return (
    <InfoContainer>
      <Typography variant="h3">Welcome to THE GAME</Typography>
      <Box
        flexDirection="column"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <TextField id="Nickname" label="nickname" variant="standard" />
        <TextField id="GameID" label="Game ID" variant="standard" />
        <Button variant="contained">Join</Button>
      </Box>
    </InfoContainer>
  );
}
