import * as tf from "@tensorflow/tfjs";
import idx2class1 from "./classIdxDict2";
import React, { useState, useEffect } from "react";
import AWS from "aws-sdk";
import Dropzone from "./Dropzone";
import "./classifier.css";
import veg from "../Images/veg.png";
import "cors";
// import dotenv from "dotenv";
// dotenv.config();
import { v4 as uuidv4 } from "uuid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  region: process.env.REACT_APP_AWS_REGION,
});

const s3 = new AWS.S3();

const Classifier = () => {
  // usestate for setting a javascript
  // object for storing and using data

  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [topNPredNames, setPrediction] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [text, setText] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  // const [isChecked, setIsChecked] = useState(true);

  const [correctText, setCorrectText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [classname, setClassname] = useState("col-md-12");

  /////////////////////////////////////////////
  const handleFormSubmit = async (teet) => {
    if (!isChecked) {
      // If the checkbox is not checked, show the input box for the user to enter the correct thing
      return;
    }

    // Clear the checkbox and correct text input
    setIsChecked(false);
    // Upload the file and text to S3 bucket if the checkbox is checked
    // console.log(`Wrong Predictions/${teet}.png`);
    const newUuid = uuidv4();
    const s3Key = `Wrong Predictions/${teet}/${newUuid}.png`;
    const bucketName = "nutripedia-storage";

    const s3params = {
      Bucket: bucketName,
      Key: s3Key,
      Body: file,
      ContentType: file.type,
      ACL: "private",
    };
    try {
      const s3Response = await s3.upload(s3params).promise();
      // console.log("File uploaded to S3:", s3Response.Location);
      setIsChecked(!isChecked);
      toast.success(
        "Thank you for contributing to the data life cycle. Your input will improve the model!"
      );

      return s3Response.Location;
    } catch (error) {
      console.log("Error uploading file to S3:", error);
    }
  };

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const handleCorrectTextChange = (event) => {
    setCorrectText("");
    setCorrectText(event.target.value);

    // setText(event.target.value);
  };

  /////////////////////////////////////////////
  const [model, setModel] = useState(null);

  /////////////////////////////////////////////
  const generateText = async (key) => {
    setClassname("col-md-6");

    console.log(classname);
    console.log("Openai");
    console.log(key);
    const openai_api_key = process.env.REACT_APP_OPENAI_API_KEY;

    const prompt = `Extract nutritional values for ${
      key.charAt(0).toUpperCase() + key.slice(1)
    } provide a detailed breakdown of the nutritional content for 100 Gram of ${
      key.charAt(0).toUpperCase() + key.slice(1)
    }. Include information such as the calorie count, vitamins and minerals, fiber content, and any other relevant nutritional information. \n\nStaple:${
      key.charAt(0).toUpperCase() + key.slice(1)
    }\n\nAnswer In this Format\n\n In 100 Grams of ${
      key.charAt(0).toUpperCase() + key.slice(1)
    } \n\nCalories:  \n\n Carbohydrates: \n\n Fiber:  \n\n Protein:  \n\n Fat:  \n\n Calcium:  \n\n Iron:  \n##\n`;

    const DEFAULT_PARAMS = {
      model: "text-davinci-003",
      temperature: 0,
      max_tokens: 150,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      prompt: prompt,
    };

    const params_ = DEFAULT_PARAMS;
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(openai_api_key),
      },
      body: JSON.stringify(params_),
    };
    const response = await fetch(
      "https://api.openai.com/v1/completions",
      requestOptions
    );
    const data = await response.json();
    console.log(data);
    var res = data.choices[0].text.trim();
    var lines = res.split("\n\n");
    let formattedText = lines.slice(1).map((line, index) => {
      // const [`${key}: `, value] = line.split(": ");
      return (
        <div>
          <div className="rows">
            <div className="col-md-2"></div>
            <div key={index} className="col-md-7 open-rows">
              {line}
              {/* <div style={{ paddingLeft: "5px" }}>{ss}</div>
              <div>{value}</div> */}
            </div>
            <div className="col-md-2"></div>
          </div>
        </div>
      );
    });

    if (lines[0]) {
      formattedText = [
        <div key="0" className="open-handle">
          <center>{lines[0]}</center>
        </div>,
        ...formattedText,
      ];
    }
    console.log("Response Text From OpenAI");
    // console.log(lines);
    setText(formattedText);
    setCorrectText("");
  };

  /////////////////////////////////////////////
  const handleImgUpload = async (uploadedFile) => {
    const imageUrl = URL.createObjectURL(uploadedFile);
    setImageUrl(imageUrl);

    setFile(uploadedFile);
    setImageLoaded(true);
    setProcessing(true);
    setIsChecked(false);
    setText(false);
    const image = new Image();
    image.src = imageUrl;
    await image.decode();
    const tensor = tf.browser
      .fromPixels(image)
      .resizeNearestNeighbor([224, 224])
      .toFloat()
      .sub(112)
      .div(112)
      .expandDims();

    const y_pred = await model.predict(tensor).data();
    console.log(y_pred);
    const topNPredNames = getTopNPredPokeObj(y_pred, 1);

    setPrediction(topNPredNames);
    console.log("-----------");
    setProcessing(false);
    setImageLoaded(false);
    return topNPredNames;
  };

  const MODEL_HTTP_URL = "api/classify";
  const MODEL_INDEXEDDB_URL = "indexeddb://pokemon-model";

  /////////////////////////////////////////////
  const getTopNPred = (pred, k) => {
    const predIdx = [];
    const predNames = [];

    const topnPred = [...pred].sort((a, b) => b - a).slice(0, k);
    console.log(topnPred);
    topnPred.map((i) => predIdx.push(pred.indexOf(i)));
    predIdx.map((i) => predNames.push(idx2class1[i]));
    console.log(predNames);
    var preds = topnPred.reduce(function (result, field, index) {
      result[predNames[index]] = field;
      return result;
    }, {});
    console.log("wwwwwwwwwwwww");

    console.log(preds);
    return preds;
  };

  /////////////////////////////////////////////
  const getTopNPredPokeObj = (pred, k) => {
    // const foundPokeObj = [];
    const predPokeName = getTopNPred(pred, k);
    console.log(predPokeName);
    return predPokeName;
  };

  /////////////////////////////////////////////
  useEffect(() => {
    async function fetchModel() {
      try {
        const localClassifierModel = await tf.loadLayersModel(
          MODEL_INDEXEDDB_URL
        );

        setModel(localClassifierModel);
        console.log("Model loaded from IndexedDB");
      } catch (e) {
        try {
          const classifierModel = await tf.loadLayersModel(MODEL_HTTP_URL);

          console.log(classifierModel);
          setModel(classifierModel);
          console.log("Model Loaded");
          await classifierModel.save(MODEL_INDEXEDDB_URL);
          console.log("Model saved to IndexedDB");
        } catch (e) {
          console.log("Unable to load model at all: ", e);
        }
      }
    }
    fetchModel();
  }, []);
  useEffect(() => {
    async function predict() {
      if (imageLoaded && file) {
        const imageElement = document.createElement("img");
        imageElement.src = file;

        imageElement.onload = async () => {
          const tensor = tf.browser
            .fromPixels(imageElement)
            .resizeNearestNeighbor([224, 224])
            .toFloat()
            .sub(112)
            .div(112)
            .expandDims();

          const y_pred = await model.predict(tensor).data();
          console.log(y_pred);
          const topNPredNames = getTopNPredPokeObj(y_pred, 1);

          setPrediction(topNPredNames);
          console.log("-----------");
          setProcessing(false);
          setImageLoaded(false);
          return topNPredNames;
        };
      }
    }

    predict();
  }, [imageLoaded, model, file]);

  return (
    <div className="row">
      <center>
        <ToastContainer />
      </center>
      <div className={classname}>
        <div className="heading">
          <h3> Capture Your Daily Dose of</h3>
          <h1 className="vit">Vitamins and Minerals</h1>
        </div>
        <div>
          {file ? (
            <img
              src={URL.createObjectURL(file)}
              className="img-style"
              alt="Uploaded Staple"
              style={{
                margin: "auto",
                width: "350px",
                height: "230px",
                display: "block",
              }}
            />
          ) : (
            <Dropzone onUpload={handleImgUpload} />
          )}
        </div>
        <div>
          {processing ? (
            <p className="heading">Loading ...</p>
          ) : topNPredNames !== null ? (
            // <div classname="heading">
            <div classname="prediction">
              {Object.entries(topNPredNames).map(([key, value]) => (
                <div classname="prediction">
                  <center>
                    <h2>{key.charAt(0).toUpperCase() + key.slice(1)}</h2>
                    <h2>
                      {Math.round(value) * 100}% That's a{" "}
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </h2>
                    <label>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                      />
                      <span style={{ fontWeight: "bold" }}>
                        This is not the correct thing
                      </span>
                    </label>
                    {isChecked ? (
                      <div classname="prediction">
                        <label>
                          <span style={{ fontWeight: "bold" }}>
                            {" "}
                            The correct thing:
                          </span>
                          <input
                            type="text"
                            // value={correctText ? correctText : "Type Here"}
                            value={correctText}
                            placeholder="Type Here"
                            onChange={handleCorrectTextChange}
                            style={{
                              width: "180px",
                              height: "35px",
                              background: "#F5F5F5",
                              border: "none",
                            }}
                          />
                          <button
                            className="button1"
                            onClick={async () => {
                              await handleFormSubmit(correctText);
                            }}
                          >
                            Submit
                          </button>
                        </label>
                      </div>
                    ) : null}
                    <button
                      className="button"
                      onClick={() =>
                        generateText(correctText !== "" ? correctText : key)
                      }
                      style={{ fontWeight: "bold" }}
                    >
                      Generate Nutritional Values for{"  "}
                      {correctText !== ""
                        ? correctText.charAt(0).toUpperCase() +
                          correctText.slice(1)
                        : key.charAt(0).toUpperCase() + key.slice(1)}
                    </button>
                  </center>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {classname === "col-md-6" ? (
        <div className="col-md-6 ">
          <img
            src={veg}
            className="open-img"
            style={{ "margin-right": "0px" }}
            alt="veg"
          />
          <div
            className="openai-al"
            style={{
              display: "inline-block",
              whiteSpace: "nowrap",
              background: "#CFFF68",
            }}
          >
            {/* <div className="open-handle ">Vitamins and Minerals</div> */}
            {text}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Classifier;
