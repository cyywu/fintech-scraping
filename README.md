# Fintech Scraping

[fintech-scraping.web.app](https://fintech-scraping.web.app/) 

The app retrieve news from global financial regulators, such as MAS and BIS, then fetch them into a firebase database.

You may:
  - browse the news database on a react web interface
  - apply different kinds of filtering technique to find out the news that you are interested in
  - subscribe to the service to get a daily email update

## Tech
* [ReactJS] - awesome javascript front end library
* [Node.js] - evented I/O for the backend
* [Firebase Firestore] - google firebase cloud database
* [Firebase Hosting ] - google firebase cloud hosting service
* [Git] - version control, and collaboration

## Installation

This app divided into two parts, `front end` and `node server`, `node server` requires [Node.js](https://nodejs.org/) to run.

Install the dependencies and devDependencies

```sh
$ cd front\ end/
$ yarn install

$ cd node\ server/
$ yarn install
```

You may expect a folder called `node_modules` in both `front end` & `node server` after the installation is done.


## Development

#### Front end
```sh
$ cd front\ end/ 
$ npm start
```

Open a browser and access to [http://localhost:3000/](http://localhost:3000/), you can now play with the front end interface.

Because it is a React project, you may only need to focus in the folder `front end/src`

#### Node server
```sh
$ cd node\ server/
$ node server.js
```
You may now interact with the server at [http://localhost:4000/](http://localhost:4000/)

You may only need to focus on these files: 
- `node server/server.js`
- `node server/function.js`


Below function is available when the server is on: 
| function | access |
| ------ | ------ |
| routine news update | autorun when the server is on, every day at 8:00 am |
| routine send email | autorun when the server is on, every day at 9:15 am |
| news update | http://localhost:4000/updateFirebaseAll |
| delete all BIS news in the database (careful)| http://localhost:4000/removeAllNewsFromBIS |
| delete all FCA news in the database (careful)| http://localhost:4000/removeAllNewsFromFCA |
| delete all MAS news in the database (careful)| http://localhost:4000/removeAllNewsFromMAS |
| check news count in the database | http://localhost:4000/checkNewsCount |
| debug (customized function for developer) | http://localhost:4000/debug  |

## Build and Deploy (Front end)
After every code is ready in `front end/src`, we first build an optimized version of it before it is deployed by running (in the `front end` folder)
```sh
$ npm run build
```

You may expect files inside the `front end/build` folder is now updated. So now we deploy this folder using firebase hosting service by running (in the `front end` folder)
```sh
$ firebase deploy
```

You may go to the [Live site](https://fintech-scraping.web.app/) now to browse the latest front end.