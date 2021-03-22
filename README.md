# egghead-downloader
Simple tool to download egghead videos


Update the `.env` file with your Bearer token so you can download egghead exclusive member lessons.
This token can be easily found in the Network tab of your browser's dev tools, in the **authorization** header of your requests.

## How to
Download video files by running these commands:
```
npm i
npm run download [COURSE_URL]
```

For example `npm run download https://egghead.io/courses/build-an-app-with-react-suspense`
