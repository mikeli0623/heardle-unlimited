import React from "react";
import { Button } from "react-bootstrap";
import { countryOptions, decadeOptions } from "../data";
import Select from "react-select";

export default function SpotifyPool({
  spotifyApi,
  setPool,
  savedPlaylists,
  activePool,
  setActivePool,
  setPoolName,
}) {
  const chooseSavedTracks = async (spotifyApi) => {
    setPoolName("My Saved Tracks");
    setActivePool(null);
    var offset = 0;
    var promises = [];
    while (offset < 200) {
      promises.push(spotifyApi.getMySavedTracks({ limit: 50, offset: offset }));
      offset += 50;
    }

    const responses = await Promise.all(promises);
    let pool = [];
    responses.map((res) => {
      if (res.body.items.length)
        res.body.items.map((item) =>
          pool.push({
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
            albumUrl: item.track.album.images[1].url,
            duration_ms: item.track.duration_ms,
          })
        );
      return res;
    });
    setPool(pool);
  };

  const containsOption = (options, compare) => {
    if (compare)
      return options.some(
        (option) =>
          option.label === compare.label && option.value === compare.value
      );
  };

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      color: "white",
      backgroundColor: state.isSelected
        ? "rgb(87, 87, 87)"
        : state.isFocused
        ? "rgb(40,42,44)"
        : "rgb(33,37,41)",
    }),
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "rgb(33,37,41)",
      border: "none",
      boxShadow: state.isFocused ? "0 0 0 4px rgb(40,42,44)" : "none",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "rgb(33,37,41)",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "white",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "white",
    }),
  };

  return (
    <div className="d-flex flex-column">
      <Button
        className="m-1 btn-dark"
        onClick={() => {
          chooseSavedTracks(spotifyApi);
        }}
      >
        My Saved Tracks
      </Button>
      <Select
        className="m-1"
        options={savedPlaylists}
        styles={customStyles}
        placeholder="My Saved Playlists"
        isSearchable
        value={containsOption(savedPlaylists, activePool) ? activePool : null}
        onChange={(e) => {
          setPoolName(`My Playlists - ${e.label}`);
          setActivePool(e);
        }}
      />
      <Select
        className="m-1"
        options={countryOptions}
        styles={customStyles}
        placeholder="Top 50 by Country"
        isSearchable
        value={containsOption(countryOptions, activePool) ? activePool : null}
        onChange={(e) => {
          setPoolName(`Top 50 Tracks - ${e.label}`);
          setActivePool(e);
        }}
      />
      <Select
        className="m-1"
        options={decadeOptions}
        styles={customStyles}
        placeholder="Top 50 by Decade"
        isSearchable
        value={containsOption(decadeOptions, activePool) ? activePool : null}
        onChange={(e) => {
          setPoolName(`Top 50 Tracks - ${e.label}`);
          setActivePool(e);
        }}
      />
    </div>
  );
}
