import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import { RadialStackedChart } from "./Chart";
import * as d3 from "d3";
import * as xlsx from "xlsx";
import Sunburst from "sunburst-chart";
import LoaderButton from "../../lib/utils/LoaderButton";

export default function S3FileUpload() {
  const [fileConverted, setFileConverted] = useState(false);
  const [fileConverted1, setFileConverted1] = useState(false);
  let [fileData, setFileData] = useState([]);

  function handleFileChange(e) {
    if (e.target.files) {
      const reader = new FileReader();
      setFileConverted(true);
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = xlsx.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = xlsx.utils.sheet_to_json(worksheet);
        // console.log(json);
        fileData = json;
        setFileData(json);
        console.log(fileData);

        let dataObj = {};
        dataObj.name = sheetName
          .toLowerCase()
          .split(" ")
          .join("")
          .split("_")
          .join("")
          .split("-")
          .join("");
        dataObj.children = [];

        Object.keys(json[0])
          .map((title) => {
            let obj = {
              name: title
                .toLowerCase()
                .split(" ")
                .join("")
                .split("_")
                .join("")
                .split("-")
                .join(""),
              children: [],
            };
            const groupByBrand = groupBy([title]);
            const groupedData = groupByBrand(json);
            const keys = Object.keys(groupByBrand(json));
            let keyChildren = [];

            keys
              .map((key) => {
                let obj = {
                  name: key
                    .toLowerCase()
                    .split(" ")
                    .join("")
                    .split("_")
                    .join("")
                    .split("-")
                    .join(""),
                  size: groupedData[key] ? groupedData[key].length : "0",
                };
                keyChildren.push(obj);
                return keyChildren;
              })
              .map((fData) => {
                obj.children = keyChildren;
                return obj;
              });
            // console.log(obj);
            dataObj.children.push(obj);
            return dataObj;
          })
          .map((data) => {
            console.log(data);
            setFileConverted1(true);
            return true;
          });
        let num = dataObj.children.length + 1;
        generateSunburstChart(num, dataObj);
      };

      reader.readAsArrayBuffer(e.target.files[0]);
    }
  }

  const generateSunburstChart = (num, dataObj) => {
    const color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, num));
    Sunburst()
      .data(dataObj)
      .label("name")
      .size("size")
      .color((d, parent) => color(parent ? parent.data.name : null))
      .tooltipContent((d, node) => `Size: <i>${node.value}</i>`)(
      document.getElementById("chart")
    );
  };

  const groupBy = (keys) => (array) =>
    array.reduce((objectsByKeyValue, obj) => {
      const value = keys.map((key) => obj[key]).join("-");
      objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
      return objectsByKeyValue;
    }, {});

  const navigateBack = () =>{
    setFileConverted(false);
    setFileData([]);
    setFileConverted1(false);
  }

  return (
    <>
      <div className="shadow-lg p-3 mb-2 bg-white rounded px-2 mt-2">
        {!fileConverted && (
          <Form>
            <Form.Group controlId="file">
              <Form.Label>Upload File</Form.Label>
              <Form.Control onChange={handleFileChange} type="file" />
            </Form.Group>
          </Form>
        )}

        {fileConverted && (
          <div>
            <LoaderButton
              block="true"
              size="lg"
              type="submit"
              className="format"
              onClick={navigateBack}
            >
              Back
            </LoaderButton>
          </div>
        )}
      </div>
      {fileConverted && (
        <div className="shadow-lg p-3 mb-2 bg-white rounded px-2 mt-2">
          <div id="chart" style={{ position: "relative" }}></div>
        </div>
      )}
      {fileConverted1 && (
        <div className="shadow-lg p-3 mb-2 bg-white rounded px-2 mt-2">
          <div style={{ position: "relative" }}>
            <RadialStackedChart data={fileData} />
          </div>
        </div>
      )}
    </>
  );
}
