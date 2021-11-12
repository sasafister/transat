var data = require("./data.json");
const ctx = document.getElementById("myChart");
const NAME = "__EMPTY";

const SPEED = 9;
const POSITION = 0;

const labels = data.map((item) => item.date);
// const position = data.map((item) => item.teamData.position);
// const speed = data.map((item) => item.teamData.speed);
const filter = ["Croatia Full of Life", "Crosscall", "Redman"];
const randomColor = () =>
  "#" + ("00000" + ((Math.random() * 16777216) << 0).toString(16)).substr(-6);

let dataset = [];
filter.map((boat) => {
  const boatData = [];
  const dataArr = [];
  data.map((item) => {
    const team = item.teamData.filter((item) => item[NAME] === boat);
    const values = Object.values(team[0]);
    dataArr.push(values[SPEED]);
  });
  boatData.push({
    label: boat,
    data: dataArr,
    borderColor: randomColor,
    borderWidth: 1,
  });
  dataset.push(boatData[0]);
});

const myChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: labels,
    datasets: dataset,
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});
