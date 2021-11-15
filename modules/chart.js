export default (labels, dataset) => {
  const ctx = document.getElementById("myChart");

  return new Chart(ctx, {
    type: "line",
    responsive: true,
    options: {
      pointRadius: 0,
    },
    data: {
      labels: labels,
      datasets: dataset,
    },
  });
};
