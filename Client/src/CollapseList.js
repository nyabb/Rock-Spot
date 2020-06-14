import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  FormControl,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  ExpansionPanelActions,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Divider,
} from "@material-ui/core";

import { ExpandMore, Delete } from "@material-ui/icons";

import {
  getPlaylists,
  createPlaylist,
  deletePlaylist,
  removeFromPlaylist,
} from "./Utils/restUtils";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: 60,
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

const CollapseList = ({ selectedTab }) => {
  const classes = useStyles();
  const [playlists, setPlaylists] = useState([]);
  const [name, setName] = useState("");

  const deleteSong = (listId, songId) => {
    removeFromPlaylist(listId, songId).then(() =>
      getPlaylists().then((res) => setPlaylists(res.data))
    );
  };
  const removePlaylist = (listId) => {
    deletePlaylist(listId).then(() =>
      getPlaylists().then((res) => setPlaylists(res.data))
    );
  };
  const addPlaylist = () => {
    createPlaylist(name).then(() =>
      getPlaylists().then((res) => setPlaylists(res.data))
    );
  };
  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  useEffect(() => {
    getPlaylists()
      .then((res) => {
        setPlaylists(res.data);
      })
      .catch((e) => {
        console.warn("Error:");
      });
  }, [selectedTab]);

  return (
    <div className={classes.root}>
      <FormControl style={{ width: 200, padding: 12 }}>
        <TextField
          id='standard-basic'
          label='Enter name'
          value={name}
          onChange={handleNameChange}
        />
        <Button
          size='small'
          color='primary'
          variant='outlined'
          onClick={addPlaylist}
          style={{ width: 200, marginTop: 5 }}
        >
          Create playlist
        </Button>
      </FormControl>
      {playlists
        ? playlists.map((playlist) => (
            <ExpansionPanel key={playlist.id}>
              <ExpansionPanelSummary
                expandIcon={<ExpandMore />}
                aria-controls='panel1a-content'
                id='panel1a-header'
              >
                <Typography className={classes.heading}>
                  {playlist.name}
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <TableContainer component={Paper} style={{ marginTop: 10 }}>
                  <Table className={classes.table} aria-label='simple table'>
                    <TableHead>
                      <TableRow>
                        <TableCell>Song name</TableCell>
                        <TableCell align='center'>Artist</TableCell>
                        <TableCell align='center'>Album)</TableCell>
                        <TableCell align='center'>Genre</TableCell>
                        <TableCell align='center'>BPM</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {playlist.songs.length > 0 ? (
                        playlist.songs.map((song) => (
                          <TableRow key={song.id}>
                            <TableCell component='th' scope='row'>
                              {song.name}
                            </TableCell>
                            <TableCell align='center'>{song.artist}</TableCell>
                            <TableCell align='center'>{song.album}</TableCell>
                            <TableCell align='center'>{song.genre}</TableCell>
                            <TableCell align='center'>{song.bpm}</TableCell>
                            <TableCell align='center'>
                              <IconButton
                                onClick={() => deleteSong(playlist.id, song.id)}
                              >
                                <Delete />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell> No songs in playlist</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </ExpansionPanelDetails>
              <Divider />
              <ExpansionPanelActions>
                <Button
                  size='small'
                  color='primary'
                  variant='outlined'
                  onClick={() => removePlaylist(playlist.id)}
                >
                  Delete playlist
                </Button>
              </ExpansionPanelActions>
            </ExpansionPanel>
          ))
        : "Loading..."}
    </div>
  );
};

export default CollapseList;
