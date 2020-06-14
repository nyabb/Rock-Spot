import { useEffect, useState } from "react";
import { getSongs } from "./Utils/restUtils";

export default function useSongSearch(query, pageNumber) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [songs, setSongs] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setSongs([]);
  }, [query]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    getSongs(pageNumber, query)
      .then((res) => {
        setSongs((prevSongs) => {
          return [...new Set([...prevSongs, ...res.data])];
        });
        setHasMore(res.data.length > 0);
        setLoading(false);
      })
      .catch((e) => {
        console.warn("Error:");
        setError(true);
      });
  }, [query, pageNumber]);

  return { loading, error, songs, hasMore };
}
