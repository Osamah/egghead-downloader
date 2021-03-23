const fetch = require("node-fetch");
const fs = require("fs");
const cheerio = require("cheerio");
const mkdirp = require("mkdirp");

const API_PREFIX = "https://app.egghead.io/api/v1";

const downloadCourse = async (url) => {
  try {
    const response = await fetch(url);
    const body = await response.text();

    $ = cheerio.load(body);

    const course = $("h1").text();
    const lessons = Array.from(
      $('ul li a[href*="/lessons/"]').map((i, el) => ({
        url: `${API_PREFIX}${$(el).attr("href")}`,
        index: ("0" + (i + 1)).substr(-2),
        name: $(el).text(),
      }))
    );
    console.log(`🔗 ${lessons.length} lesson links fetched`);

    const directory = `lessons/${course}`;
    console.log(`📂 Created directory ${directory}`);
    mkdirp.sync(directory);

    for (lesson of lessons) {
      printProgress(
        `🎬 Downloading: ${lesson.index}/${lessons.length} - ${lesson.name}`
      );

      await downloadVideo(lesson, directory);
    }

    console.log("\x07");
    return console.log("🎉 Course successfully downloaded");
  } catch (e) {
    console.log("\n\n");
    return console.log(
      "🚫 Download failed, have you added the correct Bearer token to the .env file?"
    );
  }
};

const downloadVideo = async (lesson, path) => {
  const { url, name, index } = lesson;
  const downloadUrl = await getDownloadUrlForVideo(`${url}/signed_download`);

  if (!downloadUrl) throw new Error();

  const response = await fetch(`${downloadUrl}`);
  const buffer = await response.buffer();

  fs.writeFile(`${path}/${index}-${name}.mp4`, buffer, () => {});
};

const getDownloadUrlForVideo = async (url) => {
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: process.env.AUTH,
      },
    });
    const downloadUrl = await response.text();

    return downloadUrl;
  } catch (e) {
    return false;
  }
};

function printProgress(progress) {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write(progress);
}

module.exports = downloadCourse;
