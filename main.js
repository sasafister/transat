import Chart from "./modules/chart.js";
import Dataset, { labels } from "./modules/dataset.js";

const filters = ["Croatia Full of Life"];

const dataset = Dataset("position", filters);
const chart = Chart(labels, dataset);
import Select from "./modules/select.js";

let select = document.getElementById("selector");

select.onchange = (e) => {
  const dataset = Dataset(e.target.value, filters);
  chart.data.datasets = dataset;
  chart.update();
};

Select(chart);
