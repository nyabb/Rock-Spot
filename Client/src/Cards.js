import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Avatar,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Collapse,
  Table,
  TableBody,
  TableContainer,
  TableCell,
  TableHead,
  IconButton,
  TableRow,
  Typography,
  Paper,
} from "@material-ui/core";
import clsx from "clsx";
import { red } from "@material-ui/core/colors";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import RefreshIcon from "@material-ui/icons/RefreshOutlined";
import _ from "lodash";

import { getArtists, getSongsByArtist } from "./Utils/restUtils";
import AddPopup from "./AddPopup";

const useStyles = makeStyles((theme) => ({
  root: {
    width: 700,
    margin: "10px auto",
  },

  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

export default function RecipeReviewCard() {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState("");
  const [expandedCardId, setExpandedCardId] = React.useState("");
  const [refresh, setRefresh] = React.useState(false);
  const [artists, setArtists] = React.useState([]);
  const [currentArtists, setCurrentArtists] = React.useState([]);
  const [songsByArtist, setSongsByArtist] = React.useState([]);

  const handleExpandClick = (name, id) => {
    console.log(name);
    setCurrentArtists(name);
    setExpandedCardId(name + id);
    setExpanded(!expanded);
  };

  useEffect(() => {
    getArtists()
      .then((res) => {
        console.log();
        setArtists(_.sampleSize(res.data, 20));
        setExpandedCardId("");
      })
      .catch((e) => {
        console.warn("Error:", e);
      });

    setRefresh(false);
  }, [refresh]);

  useEffect(() => {
    getSongsByArtist(currentArtists)
      .then((res) => {
        console.log();
        setSongsByArtist(res.data);
      })
      .catch((e) => {
        console.warn("Error:", e);
      });
  }, [expandedCardId, currentArtists]);

  return (
    <div style={{ position: "absolute", width: "100%", top: 60, margin: 10 }}>
      <Typography variant='h6' color='textPrimary' component='div'>
        Get 20 random artists
      </Typography>
      <IconButton onClick={() => setRefresh(true)} aria-label='refresh'>
        <RefreshIcon />
      </IconButton>
      {artists
        ? artists.map((artist) => (
            <Card className={classes.root} key={artist.id}>
              <CardHeader
                avatar={
                  <Avatar aria-label='recipe' className={classes.avatar}>
                    {artist.name.charAt(0).toUpperCase()}
                  </Avatar>
                }
                title={artist.name}
                subheader='September 14, 2016'
              />
              <CardContent>
                <Typography variant='body2' color='textSecondary' component='p'>
                  Some info about the artist
                </Typography>
              </CardContent>
              <CardActions disableSpacing>
                <IconButton
                  className={clsx(classes.expand, {
                    [classes.expandOpen]: Boolean(
                      artist.name + artist.id === expandedCardId
                    ),
                  })}
                  onClick={() => handleExpandClick(artist.name, artist.id)}
                  aria-expanded={Boolean(
                    artist.name + artist.id === expandedCardId
                  )}
                  aria-label='show songs'
                >
                  <ExpandMoreIcon />
                </IconButton>
              </CardActions>
              <Collapse
                in={Boolean(artist.name + artist.id === expandedCardId)}
                timeout='auto'
                unmountOnExit
              >
                <CardContent>
                  <Typography paragraph>Songs:</Typography>
                  <TableContainer component={Paper} style={{ marginTop: 10 }}>
                    <Table className={classes.table} aria-label='simple table'>
                      <TableHead>
                        <TableRow>
                          <TableCell>Song name</TableCell>
                          <TableCell align='center'>Artist</TableCell>
                          <TableCell align='center'>Album</TableCell>
                          <TableCell align='center'>Genre</TableCell>
                          <TableCell align='center'>BPM</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {songsByArtist.length > 0 ? (
                          songsByArtist.map((song) => (
                            <TableRow key={song.id}>
                              <TableCell component='th' scope='row'>
                                {song.name}
                              </TableCell>
                              <TableCell align='center'>
                                {song.artist}
                              </TableCell>
                              <TableCell align='center'>{song.album}</TableCell>
                              <TableCell align='center'>{song.genre}</TableCell>
                              <TableCell align='center'>{song.bpm}</TableCell>
                              <TableCell align='center'>
                                <AddPopup songId={song.id} />
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell> No songs for this artists</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Collapse>
            </Card>
          ))
        : "No Artists"}
    </div>
  );
}
