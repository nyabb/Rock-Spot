import React, { useEffect, useState } from "react";
import {
  Button,
  List,
  ListItem,
  ListItemText,
  DialogTitle,
  Dialog,
} from "@material-ui/core";
import { getPlaylists, addToPlaylist } from "./Utils/restUtils";

const SimpleDialog = ({ onClose, selectedValue, open, songId }) => {
  const [playlists, setPlaylists] = useState([]);

  const handleClose = () => {
    onClose(selectedValue);
  };

  const addToPlayList = (listId) => {
    addToPlaylist(listId, songId).then(() => onClose());
  };
  useEffect(() => {
    setPlaylists([]);
  }, []);

  useEffect(() => {
    getPlaylists()
      .then((res) => {
        setPlaylists(res.data);
      })
      .catch((e) => {
        console.warn("Error:", e);
      });
  }, [open, songId]);

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby='playlist-chooser'
      open={open}
    >
      <DialogTitle id='playlist-chooser'>Playlist Chooser</DialogTitle>

      <List>
        {playlists.length > 0 ? (
          playlists.map((playlist) => (
            <ListItem
              button
              onClick={() => addToPlayList(playlist.id)}
              key={playlist.id + songId}
            >
              <ListItemText
                primary={playlist.name}
                secondary={"Number of songs " + playlist.songs.length}
              />
            </ListItem>
          ))
        ) : (
          <ListItem>
            <ListItemText
              primary={"No playlists"}
              secondary={"Create playlists"}
            />
          </ListItem>
        )}
      </List>
    </Dialog>
  );
};

const AddPopup = ({ songId }) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant='outlined' color='primary' onClick={handleClickOpen}>
        Add to playlist
      </Button>
      <SimpleDialog open={open} songId={songId} onClose={handleClose} />
    </div>
  );
};

export default AddPopup;
