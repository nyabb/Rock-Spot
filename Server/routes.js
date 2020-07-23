const jsonServer = require("json-server");
const server = jsonServer.create();
const middlewares = jsonServer.defaults();

const cors = require("cors");
const low = require("lowdb");

const FileSync = require("lowdb/adapters/FileSync");

const playlistAdapter = new FileSync("./resources/playlists.json");
const playLists = low(playlistAdapter);

const dbAdapter = new FileSync("./resources/db.json");
const db = low(dbAdapter);
const MAX_SONG_PER_CALL = 50;

/**
 *
 * @param {*} id
 */
const _getSongById = (id) => {
  const songs = db.get("songs").value();
  return songs.find((song) => song.id.toString() === id.toString());
};

/**
 *
 * @param {*} id
 */
const _getPlayListById = (id) => {
  const playlists = playLists.get("playlists").value();
  return playlists.find((list) => list.id.toString() === id.toString());
};

/**
 * Get all Artists.
 * @param {*} req
 * @param {*} res
 */
const _getArtists = (req, res) => {
  const { id } = req.query;
  var allArtists = db.get("artists").value();
  const artists = id
    ? allArtists.filter((art) => art.id.toString() === id.toString())
    : allArtists;
  if (artists) {
    res.jsonp(artists);
  } else {
    res.message = "No artists found";
    res.sendStatus(404);
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 */
const _getSongs = (req, res) => {
  const { page = 1, filter = "" } = req.query;
  const start = MAX_SONG_PER_CALL * (page - 1);
  const end = MAX_SONG_PER_CALL * page;
  const songs = db
    .get("songs")
    .filter((song) => song.artist.toLowerCase().includes(filter.toLowerCase()))
    .slice(start, end)
    .value();
  if (songs) {
    res.jsonp(songs);
  } else {
    res.sendStatus(404);
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 */
const _getSongsByArtist = (req, res) => {
  const { name } = req.query;
  if (name) {
    const songs = db.get("songs").value();
    const songsbyArtist = songs.filter(
      (song) => song.artist.toLowerCase() === name.toLowerCase()
    );
    if (songsbyArtist) {
      res.jsonp(songsbyArtist);
    } else {
      res.sendStatus(404);
    }
  }
};
/**
 *
 * @param {*} req
 * @param {*} res
 */
const _getPlaylists = (req, res) => {
  const { id } = req.query;
  const allPlaylists = playLists.get("playlists").value();
  const playlists = id
    ? allPlaylists.filter((list) => list.id.toString() === id.toString())
    : allPlaylists;
  if (playlists) {
    res.jsonp(playlists);
  } else {
    res.message = "No playlists found";
    res.sendStatus(404);
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 */
const _createPlaylist = (req, res) => {
  const { name } = req.query;
  if (name) {
    const newPlaylist = { id: new Date().toString(), name: name, songs: [] };
    try {
      playLists.get("playlists").push(newPlaylist).write();
      res.jsonp(newPlaylist);
      //res.sendStatus(200);
    } catch {
      res.sendStatus(404);
    }
  }
};
/**
 *
 * @param {*} req
 * @param {*} res
 */
const _deletePlaylist = (req, res) => {
  const { id } = req.query;
  if (id) {
    try {
      const lists = playLists.get("playlists").value();
      const newPlayList = lists.filter((obj) => {
        return obj.id !== id;
      });
      playLists.set("playlists", newPlayList).write();

      res.jsonp(newPlayList);
      //res.sendStatus(200);
    } catch {
      res.sendStatus(404);
    }
  }
};

const _addToPlaylist = (req, res) => {
  const { listId, songId } = req.query;
  if (listId && songId) {
    try {
      const songs = _getPlayListById(listId).songs;
      const alreadyExists = songs
        .map((song) => song.id.toString())
        .includes(songId);
      if (!alreadyExists) {
        songs.push(_getSongById(songId));
      }
      playLists
        .get("playlists")
        .find({ id: listId.toString() })
        .assign({ songs: songs })
        .write();
      res.sendStatus(200);
    } catch {
      res.sendStatus(404);
    }
  }
};
const _removeFromPlaylist = (req, res) => {
  const { listId, songId } = req.query;
  if (listId && songId) {
    try {
      const songs = _getPlayListById(listId).songs;
      const newSongs = songs.filter(
        (song) => song.id.toString() !== songId.toString()
      );

      playLists
        .get("playlists")
        .find({ id: listId.toString() })
        .assign({ songs: newSongs })
        .write();

      res.sendStatus(200);
    } catch {
      res.sendStatus(404);
    }
  }
};

server.use(jsonServer.bodyParser);
server.use(cors());

// Add custom routes before JSON Server router
server.get("/artists", _getArtists);
server.get("/songs", _getSongs);
server.get("/songsByArtist", _getSongsByArtist);
server.get("/playlists", _getPlaylists);
server.post("/createPlaylist", _createPlaylist);
server.post("/deletePlaylist", _deletePlaylist);
server.post("/addToPlaylist", _addToPlaylist);
server.post("/removeFromPlaylist", _removeFromPlaylist);

//Use default router
server.use(middlewares);
server.listen(3000, function () {
  console.log("JSON Server is running");
});
