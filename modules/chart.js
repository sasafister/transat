export default (labels, dataset) => {
  const ctx = document.getElementById("myChart");

  return new Chart(ctx, {
    type: "line",
    options: {
      responsive: true,
      spanGaps: true,
      pointRadius: 3,
      scales: {
        y: {
          min: 0,
          max: 45,
        },
      },
      plugins: {
        zoom: {
          zoom: {
            wheel: {
              enabled: true,
            },
            pinch: {
              enabled: true,
            },
            mode: "x",
          },
        },
      },
    },
    data: {
      labels: labels,
      datasets: dataset,
    },
  });
};
