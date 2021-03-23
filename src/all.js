require("dotenv").config();

const fetch = require("node-fetch");
const cheerio = require("cheerio");

const downloadCourse = require("./download");

const BASE_URL = "https://egghead.io";

const getCourseLinks = async () => {
  const response = await fetch(`${BASE_URL}/courses`);
  const body = await response.text();

  $ = cheerio.load(body);

  const courses = Array.from(
    $('ul li a[href*="/courses/"] h1').map((i, el) => ({
      url: `${BASE_URL}${$(el).parent().attr("href")}`,
      index: ("0" + (i + 1)).substr(-2),
      name: $(el).text(),
    }))
  );
  console.log(`🔗 ${courses.length} course links fetched`);

  return courses;
};

const downloadAllCourses = async () => {
  const courses = await getCourseLinks();

  for (course of courses) {
    console.log(
      `\n📃 Downloading course ${course.index}/${courses.length} - ${course.name}`
    );

    await downloadCourse(course.url);
  }
};

downloadAllCourses();
