import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import Divider from "@material-ui/core/Divider";
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
      <TextField
        id='standard-basic'
        label='Enter name'
        value={name}
        onChange={handleNameChange}
      />
      <Button size='large' color='primary' onClick={addPlaylist}>
        Create playlist
      </Button>
      {playlists
        ? playlists.map((playlist) => (
            <ExpansionPanel key={playlist.id}>
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
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
                                <DeleteIcon />
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
