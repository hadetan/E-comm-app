# E-comm-app
creating a backend e-commerce appilaction

First while creating this app I installed few basic packages

```
    npm i express nodemon dotenv mongoose bcryptjs jsonwebtoken
```

After the installation was done I created a root file named as `index.js`, where we will just connect to our DB and handle our erros.

- Create an `.env` file where we will have our enviremental variables such as port (ex: `PORT=3000`) and mongoDB connection url (ex: `MONGODB_URL=mongodb://localhost:27017`) after the localhost address give a / and a name of your database

Now lets create an src folder for this project

- Create an `app.js` file where we will just import express and assign it to a variable as app and export it.

- Let us create another folder as `config` and in the file we will create `index.js` file where we will write our configurations such as ports and DB connection url. After it is done we can just import it in any of our working files and access those variables with a dot.

- for our schema's we need to have a `models` folder, after creating it we will write our all needs of our database.

- creating a `utils` folder is essential since in a business apps theres always an admin and user, there can always be more. so in this folder we will have a file where we will declare all the roles in an object.

## If you are cloning this repo, just execute - 
```
    npm i
```
