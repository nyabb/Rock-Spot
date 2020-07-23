import React from "react";
import { Button } from "@material-ui/core";
import SimpleDialog from "./SimpleDialog";

const AddPopup = ({ songId, playlists, addToPlaylist }) => {
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
      <SimpleDialog
        class={"className"}
        open={open}
        songId={songId}
        playlists={playlists}
        onClose={handleClose}
        addToPlaylist={addToPlaylist}
      />
    </div>
  );
};

export default AddPopup;
