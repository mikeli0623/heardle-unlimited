import React, { Fragment } from "react";
import * as mmb from "music-metadata-browser";

export default function LocalPool({
  setMetadataList,
  setAudioFileList,
  setPool,
  setAllFiles,
  isMetadataLoading,
  setMetadataLoading,
  metadataLoaded,
  setMetadataLoaded,
  totalFiles,
}) {
  const handleUpload = async (e) => {
    console.log(e.target.files);
    setMetadataList([]);
    setAudioFileList([]);
    setPool([]);
    setAllFiles([]);
    setMetadataLoaded(0);
    if (e.target.files.length !== 0) {
      const files = [...e.target.files].filter(
        (file) => file.type === "audio/mpeg"
      );
      setAudioFileList(files);
      setMetadataLoading(true);
      let parseList = [];
      for (var file of files) parseList.push(parseFile(file));

      Promise.all(parseList).then((data) => {
        setMetadataList(data);
        setMetadataLoading(false);
        const results = data.map((datum, index) => {
          const pic = datum.common.picture
            ? URL.createObjectURL(
                new Blob([datum.common.picture[0].data.buffer], {
                  type: "image/png",
                })
              )
            : null;
          return {
            artists: [{ name: datum.common.artist }],
            title: datum.common.title,
            pattern: datum.common.artist + " - " + datum.common.title,
            uri: URL.createObjectURL(files[index]),
            albumUrl: pic,
            duration_ms: Math.round(datum.format.duration * 1000),
          };
        });
        setAllFiles(results);
        setPool(results);
      });
    }
  };

  const parseFile = async (file) => {
    return mmb.parseBlob(file, { native: true }).then((metadata) => {
      setMetadataLoaded((prevMetadataLoaded) => prevMetadataLoaded + 1);
      return metadata;
    });
  };

  return (
    <div className="d-flex flex-column align-items-center">
      <label id="upload-label" htmlFor="upload">
        Upload Files in Directory
      </label>
      <input
        style={{ display: "none" }}
        id="upload"
        type="file"
        onChange={handleUpload}
        webkitdirectory="true"
        multiple
      />
      {isMetadataLoading && (
        <Fragment>
          <label htmlFor="metadata">
            Loading {metadataLoaded} of {totalFiles}
          </label>
          <progress id="metadata" value={metadataLoaded} max={totalFiles} />
        </Fragment>
      )}
    </div>
  );
}
