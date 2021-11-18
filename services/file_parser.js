const dataFolder = "./data/";
const fs = require("fs");
const XLSX = require("xlsx");

const CLASS40 = 0;
const MULTI50 = 2;
const IMOCA = 3;
const ULTIMES = 4;

let days = [];
fs.readdirSync(dataFolder).forEach((file) => {
  const workbook = XLSX.readFile(`${dataFolder}/${file}`);
  const sheet_name_list = workbook.SheetNames;
  const fileContents = XLSX.utils.sheet_to_json(
    workbook.Sheets[sheet_name_list[CLASS40]]
  );

  const teamFiltered = fileContents.filter(
    (item) => item.__EMPTY != "Bateau" && item.__EMPTY
  );

  const date = Object.values(fileContents[2])[0].split(" ")[13];
  const time = Object.values(fileContents[2])[0].split(" ")[14];
  const position = Object.values(teamFiltered[0])[0];
  const speed = Object.values(teamFiltered[0])[9];

  days.push({
    date: date + " " + time,
    teamData: teamFiltered,
  });
});

let data = JSON.stringify(days);
let parse = "export default " + data;
fs.writeFileSync("./data.js", parse);
