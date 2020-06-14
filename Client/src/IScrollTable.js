import React, { useState, useRef, useCallback, useEffect } from "react";
import useSongSearch from "./useSongSearch";
import { makeStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableContainer,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from "@material-ui/core";

import AddPopup from "./AddPopup";

const IScrollTable = ({ query }) => {
  const [pageNumber, setPageNumber] = useState(1);

  const { songs, hasMore, loading, error } = useSongSearch(query, pageNumber);

  const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
  });
  const classes = useStyles();

  useEffect(() => {
    setPageNumber(1);
  }, [query]);

  const observer = useRef();
  const lastSongElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <div>
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
            {songs
              ? songs.map((song, index) => {
                  return (
                    <TableRow
                      key={song.id}
                      ref={
                        songs.length === index + 1 ? lastSongElementRef : null
                      }
                    >
                      <TableCell component='th' scope='row'>
                        {song.name}
                      </TableCell>
                      <TableCell align='center'>{song.artist}</TableCell>
                      <TableCell align='center'>{song.album}</TableCell>
                      <TableCell align='center'>{song.genre}</TableCell>
                      <TableCell align='center'>{song.bpm}</TableCell>
                      <TableCell align='center'>
                        <AddPopup songId={song.id} />
                      </TableCell>
                    </TableRow>
                  );
                })
              : "Loading..."}
          </TableBody>
        </Table>
      </TableContainer>

      <div>{loading && "Loading..."}</div>
      <div>{error && "Error"}</div>
    </div>
  );
};

export default IScrollTable;
