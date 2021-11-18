import data from "../data.js";

const NAME = "__EMPTY";
const SKIPPERS = "__EMPTY_1";
const SPEED = 9;
const POSITION = 0;

const colors = ["red", "green", "blue", "purple", "yellow", "black", "cyan"];

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

export default (filters) => {
  let dataset = [];
  filters.boats.map((boat, index) => {
    const boatData = [];
    const dataArr = [];
    data.map((item) => {
      const team = item.teamData.filter((item, i) => item[NAME] === boat);
      const values = Object.values(team[0]);
      dataArr.push(values[getType(filters.type)]);
    });

    boatData.push({
      label: boat,
      data: dataArr,
      borderColor: colors[index],
      backgroundColor: colors[index],
      borderWidth: 2,

      tension: 0.4,
    });

    dataset.push(boatData[0]);
  });

  return dataset;
};

export const labels = data.map((item) => item.date);
