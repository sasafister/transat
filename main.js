import Chart from "./modules/chart.js";
import Dataset, { labels } from "./modules/dataset.js";
import SelectBoats from "./modules/selectBoats.js";
import updatePosition from "./services/last_postition.js";

const filters = {
  type: "position",
  boats: ["Croatia Full of Life"],
};

const dataset = Dataset(filters);
const chart = Chart(labels, dataset);
updatePosition(dataset);

let selectType = document.getElementById("selector");

selectType.onchange = (e) => {
  filters.type = e.target.value;
  const dataset = Dataset(filters);
  chart.data.datasets = dataset;
  updatePosition(dataset);
  chart.update();
};

SelectBoats(chart, filters);
