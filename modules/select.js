import Dataset, { teams } from "./dataset.js";

const teamNames = teams(true);

export default (chart) => {
  var selectTeams = document.getElementById("team");
  teamNames.map((team) => {
    selectTeams.options[selectTeams.options.length] = new Option(team, team);
  });

  let selectedTeams = [];
  selectTeams.onchange = (e) => {
    if (selectedTeams.includes(e.target.value)) {
      selectedTeams = selectedTeams.filter((team) => team != e.target.value);
    } else {
      selectedTeams.push(e.target.value);
    }
    const dataset = Dataset(null, selectedTeams);
    chart.data.datasets = dataset;
    chart.update();
  };
};
