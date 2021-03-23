require("dotenv").config();

const program = require("commander");
const downloadCourse = require("./download");

program.parse(process.argv);

if (program.args.length === 0) {
  return console.error("Pass a url to an egghead series");
}

const run = async () => {
  try {
    await downloadCourse(program.args[0]);
    console.log("\x07");
    return console.log("🎉 Course successfully downloaded");
  } catch (e) {
    console.log("\n\n");
    return console.log("🚫 Download failed, have you added the correct Bearer token to the .env file?");
  }
};

run();
