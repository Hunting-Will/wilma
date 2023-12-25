import { styled } from '@mui/material/styles';
import Paper from "@mui/material/Paper";

export const InfoContainer = styled(Paper)(({theme}) => ({
    padding: theme.spacing(2),
    textAlign: "center"
}));