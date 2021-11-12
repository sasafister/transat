const dataFolder = "./data/";
const fs = require("fs");
const XLSX = require("xlsx");

const CLASS40 = 0;
const MULTI50 = 2;
const IMOCA = 3;
const ULTIMES = 4;

// const workbook = XLSX.readFile(`${dataFolder}/xls211111_190738.xls`);
// const sheet_name_list = workbook.SheetNames;
// const fileContents = XLSX.utils.sheet_to_json(
//   workbook.Sheets[sheet_name_list[CLASS40]]
// );

// const teamFiltered = fileContents.filter(
//   (item) => item.__EMPTY === "Croatia Full of Life"
// );

// console.log(Object.values(teamFiltered[0])[2]);

let days = [];
let sailors = "";
fs.readdirSync(dataFolder).forEach((file) => {
  const workbook = XLSX.readFile(`${dataFolder}/${file}`);
  const sheet_name_list = workbook.SheetNames;
  const fileContents = XLSX.utils.sheet_to_json(
    workbook.Sheets[sheet_name_list[CLASS40]]
  );

  const teamFiltered = fileContents.filter(
    (item) => item.__EMPTY === "Croatia Full of Life"
  );

  const date = Object.values(fileContents[2])[0].split(" ")[13];
  const time = Object.values(fileContents[2])[0].split(" ")[14];
  const position = Object.values(teamFiltered[0])[0];
  const speed = Object.values(teamFiltered[0])[9];
  //   sailors = Object.values(fileContents[2])[0];

  days.push({
    date: date + " " + time,
    teamData: {
      position: position,
      speed: speed,
    },
  });
});

let data = JSON.stringify(days);
fs.writeFileSync("./data.json", data);
