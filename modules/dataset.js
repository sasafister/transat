import data from "../data.js";

const NAME = "__EMPTY";
const SKIPPERS = "__EMPTY_1";
const SPEED = 9;
const POSITION = 0;

const randomColor = () =>
  "#" + ("00000" + ((Math.random() * 16777216) << 0).toString(16)).substr(-6);

const getType = (type) => {
  switch (type) {
    case "position":
      return POSITION;
    case "speed":
      return SPEED;
    default:
      return POSITION;
  }
};

export const teams = (key) => {
  const teams = [];
  const teamArr = Object.values(data[0].teamData);
  key
    ? teamArr.map((team) => teams.push(team[NAME]))
    : teamArr.map((team) => teams.push(team));

  return teams;
};

export default (type, filters) => {
  let dataset = [];

  filters.map((boat) => {
    const boatData = [];
    const dataArr = [];
    data.map((item) => {
      const team = item.teamData.filter((item) => item[NAME] === boat);
      const values = Object.values(team[0]);
      dataArr.push(values[getType(type)]);
    });

    boatData.push({
      label: boat,
      data: dataArr,
      borderColor: randomColor,
      borderWidth: 2,
      cubicInterpolationMode: "monotone",
      tension: 0.4,
    });

    dataset.push(boatData[0]);
  });

  return dataset;
};

export const labels = data.map((item) => item.date);
