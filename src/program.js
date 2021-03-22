require("dotenv").config();

const program = require("commander");
const downloadCourse = require("./download");

program.parse(process.argv);

if (program.args.length === 0) {
  return console.error("Pass a url to an egghead series");
}

const run = () => {
  downloadCourse(program.args[0]);
  console.log("\x07");
  return console.log("All Done 🎉");
};

run();
