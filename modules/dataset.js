import data from "../data.js";

const NAME = "__EMPTY";
const SKIPPERS = "__EMPTY_1";
const SPEED = 9;
const POSITION = 0;
let avgSpeedArr = [];

const colors = ["red", "green", "blue", "purple", "yellow", "black", "cyan"];

const getType = (type) => {
  switch (type) {
    case "position":
      return POSITION;
    case "speed":
      return SPEED;
    case "skippers":
      return SKIPPERS;
    default:
      return POSITION;
  }
};

const _getSpeedAvarage = () => {
  var total = 0;
  var count = 0;

  avgSpeedArr.forEach((item) => {
    total += item;
    count++;
  });

  return (total / count).toFixed(2);
};

export const teams = (key) => {
  const teams = [];

  // Select newest position boats from last .xls file
  const parseDataInArr = Object.values(data);
  const teamArr = parseDataInArr[parseDataInArr.length - 1].teamData;
  key
    ? teamArr.map((team) => teams.push(team[NAME]))
    : teamArr.map((team) => teams.push(team));

  return teams;
};

export default (filters) => {
  let dataset = [];

  filters.boats.map((boat, index) => {
    const boatData = [];
    const dataArr = [];
    let lastPosition = 0;
    let skippers = "";

    data.map((item) => {
      const team = item.teamData.filter((item, i) => item[NAME] === boat);
      const values = Object.values(team[0]);
      skippers = team[0][getType("skippers")];

      dataArr.push(values[getType(filters.type)]);
      lastPosition = values[getType("position")];
      avgSpeedArr.push(values[getType("speed")]);
    });

    boatData.push({
      label: boat,
      data: dataArr,
      borderColor: colors[index],
      backgroundColor: colors[index],
      fill: false,
      borderWidth: 1,
      pointStyle: "rectRot",
      pointRadius: 3,
      lastPosition: lastPosition,
      avgSpeed: _getSpeedAvarage(),
      skippers: skippers,
    });

    dataset.push(boatData[0]);
  });

  return dataset;
};

export const labels = data.map((item) => item.date);
