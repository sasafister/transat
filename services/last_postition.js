export default (dataset) => {
  const lastPosition = document.getElementById("last_position");
  lastPosition.innerHTML = "";
  dataset.map((boat) => {
    lastPosition.innerHTML += `
      <li>
        <span class="boat-name">${boat.label}</span> 
        <span class="skippers">Skippers: <span class="bold">${boat.skippers}</span></span>
        <span class="last-position-text">Last position: <span class="bold">#${boat.lastPosition}</span></span>
        <span class="avg-speed">Avg speed: <span class="bold">${boat.avgSpeed} knots</span></span>
      </li>`;
  });
  return lastPosition;
};
