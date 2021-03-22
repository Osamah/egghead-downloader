const fetch = require("node-fetch");
const fs = require("fs");
const cheerio = require("cheerio");
const mkdirp = require("mkdirp");

const API_PREFIX = "https://app.egghead.io/api/v1";

const downloadCourse = async (url) => {
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

  const directory = `lessons/${course}`;
  console.log(`\nWriting: ${directory}`);
  mkdirp.sync(directory);

  console.log(lessons);

  for (lesson of lessons) {
    await downloadVideo(lesson, directory);
  }
};

const downloadVideo = async (lesson, path) => {
  const { url, name, index } = lesson;
  const downloadUrl = await getDownloadUrlForVideo(`${url}/signed_download`);
  const response = await fetch(`${downloadUrl}`);
  const buffer = await response.buffer();

  fs.writeFile(`${path}/${index}-${name}.mp4`, buffer, () =>
    console.log(`${name} successfully downloaded!`)
  );
};

const getDownloadUrlForVideo = async (url) => {
  const response = await fetch(url, {
    headers: {
      Authorization: process.env.AUTH,
    },
  });
  const downloadUrl = await response.text();

  return downloadUrl;
};

module.exports = downloadCourse;
