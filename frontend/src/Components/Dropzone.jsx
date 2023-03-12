import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
// import cloud from "../Images/upload.png";
import cloud from "../Images/cloud.png";
import "./Dropzone.css";
import styled from "styled-components";

const getColor = (props) => {
  if (props.isDragAccept) {
    return "#00e676";
  }
  if (props.isDragReject) {
    return "#ff1744";
  }
  if (props.isFocused) {
    return "#2196f3";
  }
  return "#eeeeee";
};

const Container = styled.div`
  margin-left: 200px;
  width: 1200px;
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-width: 2px;
  border-radius: 2px;
  border-color: ${(props) => getColor(props)};
  border-style: dashed;
  background-color: #fafafa;
  outline: none;
  transition: border 0.24s ease-in-out;
`;

const Dropzone = ({ onUpload }) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      const uploadedFile = acceptedFiles[0];
      onUpload(uploadedFile);
    },
    [onUpload]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: false,
  });

  return (
    <div className="dropzone-div">
      <Container {...getRootProps()}>
        <input className="dropzone-input" {...getInputProps()} />
        <img src={cloud} alt="cloud" width="58px" height="50px" />
        <br></br>
        <br></br>
        <center>
          <p style={{ fontWeight: "bold" }}>
            Select a file or drag and drop here
          </p>
        </center>
        <p style={{ color: "grey" }}>JPG,PNG file size no more then 10MB</p>

        <button className="button">Select File Or Drop Here.</button>
      </Container>
    </div>
    // <div {...getRootProps()}>
    //   <input {...getInputProps()} />
    //   {isDragActive ? (
    //     <p>Drop the image file here...</p>
    //   ) : (
    //     <button style={{ background: "#CFFF68" }}>
    //       Select File Or Drop Here.
    //     </button>
    //   )}
    //   {selectedFile && <p>Selected file: {selectedFile.name}</p>}
    // </div>
  );
};

export default Dropzone;
