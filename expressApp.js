import pg from "pg";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ...(process.env.NODE_ENV === "production"
        ? {
            ssl: {
                rejectUnauthorized: false
            }
        }
        : {}),
});

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.static("static"));
app.use(express.json());

const errorHandler1 = (req, res, next) => {
    res.sendStatus(404);
    next();
};

app.get("/api/cars", (req, res, next) => {
    pool.query("SELECT * FROM cars;").then((data) => {
        res.send(data.rows);
    }).catch(next);
});

app.get("/api/people", (req, res, next) => {
    pool.query("SELECT * FROM people;").then((data) => {
        res.send(data.rows);
    }).catch(next);
});

app.get("/api/cars/:id", (req, res, next) => {
    console.log(req.params.id);
    const id = req.params.id;
    pool.query("SELECT * FROM cars WHERE car_id = $1;", [id]).then((data) =>{
        if(data.rows[0]){
            res.send(data.rows[0]);
        } else {
            res.sendStatus(404);
        }   
    }).catch(next);
});

app.get("/api/people/:id", (req, res, next) => {
    console.log(req.params.id);
    const id = req.params.id;
    pool.query("SELECT * FROM people WHERE person_id = $1;", [id]).then((data) =>{
        if(data.rows[0]){
            res.send(data.rows[0]);
        } else {
            res.sendStatus(404);
        }   
    }).catch(next);
});

app.delete("/api/cars/:id", (req, res, next) => {
    const id = req.params.id;
    pool.query("DELETE FROM cars WHERE car_id = $1 RETURNING *;", [id]).then((data) => {
        if(data.rows.length === 0) {
            res.sendStatus(404);
        } else {
            res.status(204).send(data.rows[0]);
        }
    }).catch(next)
});

app.delete("/api/people/:id", (req, res, next) => {
    const id = req.params.id;
    pool.query("DELETE FROM cars WHERE person_id = $1 RETURNING *;", [id]).then((data) => {
        if(data.rows.length === 0) {
            res.sendStatus(404);
        } else {
            res.status(204).send(data.rows[0]);
        }
    }).catch(next)
});

app.post("/api/cars", (req, res, next) => {
    const newCar = req.body;
    console.log(req.body);
    if(newCar.year && newCar.make && newCar.model && newCar.color && newCar.person_id){
        pool.query(`INSERT INTO cars (year, make, model, color, person_id)
            VALUES ($1, $2, $3, $4, $5);`,
            [newCar.year, newCar.make, newCar.model, newCar.color, newCar.person_id]
        ).then((data) => {
            res.status(201).send(newCar);
        }).catch(next)
    } else {
        res.sendStatus(400);
    }
});

app.post("/api/people", (req, res, next) => {
    const newPerson = req.body;
    console.log(req.body);
    if(newPerson.name && newPerson.age){
        pool.query(`INSERT INTO people (name, age) VALUES ($1, $2);`,
        [newPerson.name, newPerson.age]
        ).then((data) => {
            res.status(201).send(newPerson);
        }).catch(next)
    } else {
        res.sendStatus(400);
    }
});

app.patch("/api/cars/:id", (req, res, next) => {
    const id = req.params.id;
    const update = req.body;
    if(update.year || update.make || update.model || update.color || update.person_id) {
        pool.query(`UPDATE cars
        SET year = COALESCE($1, year), 
            make = COALESCE($2, make),  
            model = COALESCE($3, model),
            color = COALESCE($4, color), 
            person_id = COALESCE($5, person_id) 
        WHERE car_id = $6
        RETURNING *;`, 
        [update.year, update.make, update.model, update.color, update.person_id, id]).then(data => {
            if(data.rows.length === 0){
                res.sendStatus(404);
            } else {    
            res.status(200).send(data.rows[0]); 
            }
        }).catch(next) 
    } else {
        res.sendStatus(400);
        }                                  
});

app.patch("/api/people/:id", (req, res, next) => {
    const id = req.params.id;
    const update = req.body;
    if(update.name || update.age) {
        pool.query(`UPDATE people
        SET name = COALESCE($1, name), 
            age = COALESCE($2, age)  
        WHERE person_id = $3
        RETURNING *;`, 
        [update.name, update.age, id]).then(data => {
            if(data.rows.length === 0){
                res.sendStatus(404);
            } else {    
            res.status(200).send(data.rows[0]); 
            }
        }).catch(next) 
    } else {
        res.sendStatus(400);
        }                                  
});

app.use(errorHandler1);
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(`${PORT}`, () => {
    console.log(`listening on port ${PORT}`)
});