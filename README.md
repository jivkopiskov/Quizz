﻿# Quiz App
## How to run:

1. Go to QuizzAPI and update the connection string for the DB  in the appsettings.json
2. Build and run the QuizzAPI server with the Kestrel server at port 5001. If the port is already used, you will need to update the URLs in the Quiz App, since we are retrieving the data from there
3. Navigate to QuizApp and run in the terminal "npm install" and "npm run-dev". The server is configured to run at port 3000. If the port is busy, and it starts on another port, you'll need to update the CORS policy of the API server, to include this origin. This can be done in the StartUp.cs file of the API server
4. If is set up correctly, the app should be running and you should be able to test the app
