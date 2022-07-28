DROP TABLE IF EXISTS people, cars;

CREATE TABLE people(
    person_id SERIAL PRIMARY KEY,
    name TEXT,
    age INTEGER
);

CREATE TABLE cars(
    car_id SERIAL PRIMARY KEY,
    year INTEGER,
    make TEXT,
    model TEXT,
    color TEXT,
    person_id INTEGER NOT NULL,
    CONSTRAINT fk_person
    FOREIGN KEY(person_id) 
	REFERENCES people(person_id)
);

