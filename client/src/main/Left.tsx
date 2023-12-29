import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";

import { Player } from "../../../types";
import { GameController } from "../../../game-logic/GameController";

export function Left({ game }: { game: GameController }) {
  return (
    <List style={{overflow: "auto"}}>
      {game.players.map((p) => (
        <PlayerCard player={p} />
      ))}
    </List>
  );
}

function PlayerCard({ player }: { player: Player }) {
  return (
    <ListItem alignItems="center">
      <ListItemAvatar>
        <Avatar>{player.Nickname[0]}</Avatar>
      </ListItemAvatar>
      <ListItemText>
        <Typography>{player.Nickname}</Typography>
      </ListItemText>
    </ListItem>
  );
}
