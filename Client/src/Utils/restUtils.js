import axios from "axios";
const BASE_URL = "http://localhost:3000/";

const doRequest = (method, path, params = {}) => {
  return axios({
    method: method,
    url: BASE_URL + path,
    params: params,
  });
};

const getSongs = (page, filter) => {
  return doRequest("get", "songs", { page, filter });
};
const getPlaylists = (id) => {
  return doRequest("get", "playlists", { id });
};
const getArtists = (id) => {
  return doRequest("get", "artists", { id });
};
const getSongsByArtist = (name) => {
  return doRequest("get", "songsByArtist", { name });
};
const createPlaylist = (name) => {
  return doRequest("post", "createPlaylist", { name });
};
const deletePlaylist = (id) => {
  return doRequest("post", "deletePlaylist", { id });
};
const addToPlaylist = (listId, songId) => {
  return doRequest("post", "addToPlaylist", { listId, songId });
};
const removeFromPlaylist = (listId, songId) => {
  return doRequest("post", "removeFromPlaylist", { listId, songId });
};

export {
  getSongs,
  getPlaylists,
  getArtists,
  getSongsByArtist,
  createPlaylist,
  deletePlaylist,
  addToPlaylist,
  removeFromPlaylist,
};
