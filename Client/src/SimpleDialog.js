import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  DialogTitle,
  Dialog,
} from "@material-ui/core";

const SimpleDialog = ({
  onClose,
  selectedValue,
  open,
  songId,
  playlists,
  addToPlaylist,
}) => {
  const handleClose = () => {
    onClose(selectedValue);
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby='playlist-chooser'
      open={open}
    >
      <DialogTitle id='playlist-chooser'>Playlist Chooser</DialogTitle>

      <List>
        {playlists.map((playlist) => (
          <ListItem
            button
            onClick={addToPlaylist(playlist.id, songId)}
            key={playlist.id + songId}
          >
            <ListItemText
              primary={playlist.name}
              secondary={"Number of songs " + playlist.songs.length}
            />
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
};
export default SimpleDialog;
