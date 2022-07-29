## Key Features
* Created 2 tables in a database 1 for people and 1 for cars.
* Cars table has a foreign key reference to the people table.
* Handles GET, POST, PATCH, and DELETE requests to the server.
* Makes an AJAX call to the local database to view the people table when the people button is clicked.
* Makes an AJAX call to the local database to view the cars table when the cars button is clicked.
* This app is deployed on Heroku
## USE
This app listens to port 3000 by default but when deployed it will listen on any PORT given in the .env file. To view my app on Heroku paste "https://arcane-atoll-14578.herokuapp.com/" in a web browser. Click on the People button to view the current people table and click on the cars button to view the current cars table.
