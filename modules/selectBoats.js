import Dataset, { teams } from "./dataset.js";
import updatePosition from "../services/last_postition.js";

const teamNames = teams(true);

export default (chart, filters) => {
  var selectTeams = document.getElementById("team");
  teamNames.map((team, index) => {
    selectTeams.options[index] = new Option(team, team);
  });

  selectTeams.onchange = (e) => {
    if (filters.boats.includes(e.target.value)) {
      filters.boats = filters.boats.filter((team) => team != e.target.value);
      _toggleBackgroundColor("remove", e.target.value);
    } else {
      filters.boats.push(e.target.value);
      _toggleBackgroundColor("add", e.target.value);
    }
    const dataset = Dataset(filters);
    chart.data.datasets = dataset;
    updatePosition(dataset);
    chart.update();
  };

  const _toggleBackgroundColor = (action, value) => {
    for (var i = 0; i < selectTeams.options.length; i++) {
      if (selectTeams.options[i].value === value) {
        selectTeams.options[i].classList[action]("active");
      }
    }
  };
  _toggleBackgroundColor("add", "Croatia Full of Life");
};
