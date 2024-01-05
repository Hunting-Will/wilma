import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";

import { Player } from "@wilma/types";
import { GameController } from "../../../game-logic/GameController";
import { Box } from "@mui/material";

export function Left({ game }: { game: GameController }) {
  return (
    <Box alignSelf="start">
      <List style={{ overflow: "auto" }}>
        {game.players.map((p) => (
          <PlayerCard key={p.ID} player={p} />
        ))}
      </List>
    </Box>
  );
}

function PlayerCard({ player }: { player: Player }) {
  return (
    <ListItem alignItems="center">
      <ListItemAvatar>
        <Avatar>{player.Nickname[0]}</Avatar>
      </ListItemAvatar>
      <ListItemText>
        <Typography variant="h6">{player.Nickname}</Typography>
      </ListItemText>
      <ListItemText>
        <Typography variant="h6" marginLeft={3}>{player.Score}</Typography>
      </ListItemText>
    </ListItem>
  );
}
