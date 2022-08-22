import React, { useContext } from "react";
import ModeContext from "./ModeContext";
import { Button } from "react-bootstrap";
import FilteredDropdown from "./FilteredDropdown";
import { countryCodes, decadeCodes } from "./data";

export default function Settings({
  spotifyApi,
  setSearchResults,
  close,
  savedPlaylists,
  activeSavedPlaylist,
  setActiveSavedPlaylist,
  activeCountry,
  setActiveCountry,
  activeDecade,
  setActiveDecade,
}) {
  const { mode } = useContext(ModeContext);
  const chooseSavedTracks = async (spotifyApi, setSearchResults) => {
    var offset = 0;
    var promises = [];
    while (offset < 200) {
      promises.push(spotifyApi.getMySavedTracks({ limit: 50, offset: offset }));
      offset += 50;
    }

    const responses = await Promise.all(promises);
    responses.map((res) => {
      if (res.body.items.length)
        setSearchResults(
          res.body.items.map((item) => {
            return {
              artists: item.track.artists,
              title: item.track.name,
              pattern: (
                item.track.artists.map((artist) => {
                  return artist.name;
                }) +
                " - " +
                item.track.name
              ).replace(",", " "),
              uri: item.track.uri,
              id: item.track.id,
              album: item.track.album.name,
              albumUrlLarge: item.track.album.images[0].url,
              albumUrlMed: item.track.album.images[1].url,
              albumUrlSmall: item.track.album.images[2].url,
              duration: Math.round(item.track.duration_ms / 1000),
            };
          })
        );
      return res;
    });
  };

  const chooseNewReleases = (spotifyApi, setSearchResults) => {
    spotifyApi.getNewReleases({ limit: 50 }).then(
      (res) => {
        setSearchResults(
          res.body.albums.items.map((item) => {
            return {
              artists: item.artists,
              title: item.name,
              pattern: (
                item.artists.map((artist) => {
                  return artist.name;
                }) +
                " - " +
                item.name
              ).replace(",", " "),
              uri: item.uri,
              id: item.id,
              album: item.name,
              albumUrlLarge: item.images[0].url,
              albumUrlMed: item.images[1].url,
              albumUrlSmall: item.images[2].url,
              duration: Math.round(item.duration_ms / 1000),
            };
          })
        );
      },
      (err) => {
        console.log("Something went wrong!", err);
      }
    );
  };

  const clearSelected = () => {
    setActiveSavedPlaylist(null);
    setActiveCountry(null);
    setActiveDecade(null);
  };

  return (
    <div className="flex-grow-1">
      <Button
        disabled={mode === "guest"}
        onClick={() => {
          chooseSavedTracks(spotifyApi, setSearchResults);
        }}
      >
        My Saved Tracks
      </Button>
      <Button
        onClick={() => {
          chooseNewReleases(spotifyApi, setSearchResults);
        }}
      >
        New Releases
      </Button>
      <FilteredDropdown
        name="My Saved Playlists"
        list={Object.keys(savedPlaylists)}
        clear={clearSelected}
        activeItem={activeSavedPlaylist}
        setActiveItem={setActiveSavedPlaylist}
        isDisabled={mode === "guest"}
      />
      <FilteredDropdown
        name="Top 50 by Decade"
        list={Object.keys(decadeCodes)}
        clear={clearSelected}
        activeItem={activeDecade}
        setActiveItem={setActiveDecade}
      />
      <FilteredDropdown
        name="Top 50 by Country"
        list={Object.keys(countryCodes)}
        clear={clearSelected}
        activeItem={activeCountry}
        setActiveItem={setActiveCountry}
      />
      <Button className="btn-danger" onClick={close}>
        Close
      </Button>
    </div>
  );
}
