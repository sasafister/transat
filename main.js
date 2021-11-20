import Chart from "./modules/chart.js";
import Dataset, { labels } from "./modules/dataset.js";
import SelectBoats from "./modules/selectBoats.js";

const filters = {
  type: "position",
  boats: ["Croatia Full of Life"],
};

const dataset = Dataset(filters);
const chart = Chart(labels, dataset);

let selectType = document.getElementById("selector");

selectType.onchange = (e) => {
  filters.type = e.target.value;
  chart.data.datasets = Dataset(filters);
  chart.update();
};

SelectBoats(chart, filters);
