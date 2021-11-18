export default (labels, dataset) => {
  const ctx = document.getElementById("myChart");

  return new Chart(ctx, {
    type: "line",
    options: {
      responsive: true,
      pointRadius: 2,
      cubicInterpolationMode: "monotone",
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
