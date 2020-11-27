# SWN Character Generator

# Required setup to run:
- Have Node.js installed
- Run the database server (instructions/resources coming soon)
- Set the following environment variables (or create a .env file in /server with them), defaults are also provided here:
    - **PORT** : 5000 - Port for the web server
    - **DB_USER** : scg_user - Name for the database user
    - **DB_PASSWORD** : *redacted* - Password for the database user
    - **DB_HOST** : localhost - Host IP of the database server
    - **DB_PORT** : *null* - Port for the database serer (currently unused)
    - **DB_DIALECT** : mysql - Dialect of the database server

# How to run (DEV):
- In a terminal at /server:
    - npm install
    - npm start
- In another terminal at /server/client:
    - npm install
    - npm start
- Starting the client will launch a browser. To manually visit the app, go to localhost:3000

# How to run (PROD):
- Build the client at /server/client:
    - npm install
    - npm run build
- Run the server at /server:
    - npm install
    - npm start
- Visit the app at localhost:5000

# Working method:
- Work is tracked in Trello: https://trello.com/b/AFs1wFcp/final-year-project
- Agile sprints are used with a length of 2 weeks, tracked very casually in Trello
- Complete, working features will be commited to a "release" branch every other Friday, at the end of each sprint
- After the initial setup, features will be developed on their own branches and merged in after testing
- This ensures I can release a working build every other Friday by isolating potentially buggy or incomplete features

# Architecture
- A node.js web server is hosted using express
- A MySQL database is hosted
- React.js components are written in Typescript and compiled to Javascript
- HTML and the javascript is distributed to clients that render the webapp