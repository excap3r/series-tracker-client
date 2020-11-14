# Automatic Series Tracker
- Rewritten into TypeScript

This allows you to watch your favorite series on VLC and automatically synchronize series with [Series-Tracker](https://github.com/JakubSladek/series-tracker).

## How does that work? 🤔

- App listens to VLC port and triggers an event on status change, then checks if it has season and episode.
- If its recognized as a series(have season and episode in meta or in title/filename) will be processed and then App will fetch all your series from site through WP-Rest API.
- Then it checks if the name of series that's got from VLC exists on Website and if there's a difference between season and/or episodes, then app will send an update request to WP-Rest API, if the series doesn't already exist in Rest, then app will try to create a new series post.


## Installation 🚀

- Requirements:
  - [Node.js](https://nodejs.org/)
  - [NPM](https://www.npmjs.com/get-npm) (installed with Node.js)
  - A [series-tracker](https://github.com/JakubSladek/series-tracker-client) website to be registered on.

1. Download last [release](https://github.com/JakubSladek/series-tracker-client/releases)
2. Unzip folder and grab it where do you want
3. Double click on install.bat and wait for all modules to install or open the project's main directory in terminal and type "npm install" and wait for all modules to install

## How to start 🤖

- Be sure you've passed VLC Configuration & Tracker Configuration below.

- Windows: double-click on "start.bat"
- Terminal: type "node main"

- If your VLC is working correctly and is running then it will automatically connect and will respond with something like "Succesfully connected"
- Now just play your favorite series on VLC and Tracker will automatically sync your series to website

## VLC Configuration ▶️

- You need to have enabled Web(http) interface module and your password set.

1. Open VLC.
2. Click at Tools and Preferences.
3. At left bottom click to "All" under "Show settings".
4. Scroll down to "Interface" and click on "Main interfaces", be sure you have checked "Web" option.
5. Click to "Main interfaces" dropdown arrow.
6. Click on "Lua" and at your right-side under "Lua HTTP" and enter Password you want to use.


## Tracker Configuration 🛠️

- You have to use any text editor or IDE to edit config.js
- Use example shown under this text to edit your config

```javascript
export default {
    tracker: {
        username: "name",     // Login name to series-tracker website
        password: "password", // Login password to series-tracker website
    },
    vlc: {
        password: "password", // Your VLC HTTP password	
        host: "localhost",    // If u running VLC on same PC as Tracker then keep that on 'localhost'
        port: "8080",         // Your VLC port, default is 8080
        refreshMs: 20000,     // Time between updates in VLC web client in miliseconds
    },
};

```
