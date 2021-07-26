"use strict";

const express = require("express");
const app = express();
const PORT = 8000;
const cors = require("cors");
const axios = require("axios");
const bodyParser = require("body-parser");
const { Client } = require("pg");
const { response } = require("express");

var async = require("async");
const fetch = require("node-fetch");

//Connects to a database named "rxnorm_ui"
const client = new Client({
    user: "postgres",
    password: "postgres1",
    host: "localhost",
    port: "5432",
    database: "rxnorm_ui",
});

app.use(bodyParser.urlencoded({ limit: "50mb", extended: true })); // false
app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(cors());
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
});

start();
async function start() {
    await connect();
}

//Connects to the database
async function connect() {
    try {
        await client.connect();
    } catch (e) {
        console.error(`Failed to connect: ${e}`);
    }
}

// localhost:8000

app.get("/home", (req, res) => res.sendFile(`${__dirname}/index.html`));

app.get("/", async (req, res) => {
    const rows = await readAllMinConcepts();
    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify(rows));
});

app.get("/:concept", async (req, res) => {
    console.log("app.get /search_term");
    const concept = req.params.concept;
    console.log("req.params.concept: ", concept);
    const rows = await searchFilledDatabase(concept);
    res.send(JSON.stringify(rows));
});

app.post("/search", async (req, res) => {
    const result = {};
    console.log(
        "req.body data received: ",
        req.body,
        "^^^ req.body posted to /search"
    );

    const searchData = req.body.searchData;
});

app.post("/bn", async (req, res) => {
    const result = {};
    console.log("RUNNING /BN");
    console.log("////////////\n\nreq.body data received: ", req.body);
    const name = req.body.nameHolder;
    const rxcui = req.body.rxcuiHolder;

    try {
        console.log(" Enter /bn try block for concept ", name);
        await axios
            .get(
                "https://rxnav.nlm.nih.gov/REST/rxcui/" +
                    rxcui +
                    "/allrelated.json"
            )
            .then((response) => {
                console.log(
                    "\n\n\n------ RESPONSE DATA FOR /BN ------" +
                        JSON.stringify(
                            response.data.allRelatedGroup.conceptGroup[0]
                                .conceptProperties
                        ) +
                        "---^^^ RESPONSE DATA FOR /BN ^^^---"
                );
                return response.data;
            })
            .then((data) => {
                res.send({
                    result:
                        data.allRelatedGroup.conceptGroup[0].conceptProperties,
                });
            });
    } catch (error) {
        console.log("ERROR running fetch /bn for " + name + ".", error);
    }
});

app.post("/in", async (req, res) => {
    const result = {};
    console.log("RUNNING /IN");
    console.log("////////////\n\nreq.body data received: ", req.body);
    const name = req.body.nameHolder;
    const rxcui = req.body.rxcuiHolder;

    try {
        console.log(" Enter /in try block for concept ", name);
        await axios
            .get(
                "https://rxnav.nlm.nih.gov/REST/rxcui/" +
                    rxcui +
                    "/allrelated.json"
            )
            .then((response) => {
                console.log(
                    "\n\n\n------ RESPONSE DATA FOR /IN ------" +
                        JSON.stringify(
                            response.data.allRelatedGroup.conceptGroup[4]
                                .conceptProperties
                        ) +
                        "---^^^ RESPONSE DATA FOR /IN ^^^---"
                );
                return response.data;
            })
            .then((data) => {
                res.send({
                    result:
                        data.allRelatedGroup.conceptGroup[4].conceptProperties,
                });
            });
    } catch (error) {
        console.log("ERROR running fetch /in for " + name + ".", error);
    }
});

app.post("/min", async (req, res) => {
    const result = {};
    console.log("RUNNING /MIN");
    console.log("////////////\n\nreq.body data received: ", req.body);
    const name = req.body.nameHolder;
    const rxcui = req.body.rxcuiHolder;

    try {
        console.log(" Enter /min try block for concept ", name);
        await axios
            .get(
                "https://rxnav.nlm.nih.gov/REST/rxcui/" +
                    rxcui +
                    "/allrelated.json"
            )
            .then((response) => {
                console.log(
                    "\n\n\n------ RESPONSE DATA FOR /MIN ------" +
                        JSON.stringify(
                            response.data.allRelatedGroup.conceptGroup[5]
                                .conceptProperties
                        ) +
                        "---^^^ RESPONSE DATA FOR /MIN ^^^---"
                );
                return response.data;
            })
            .then((data) => {
                res.send({
                    result:
                        data.allRelatedGroup.conceptGroup[5].conceptProperties,
                });
            });
    } catch (error) {
        console.log("ERROR running fetch /min for " + name + ".", error);
    }
});

app.post("/bpck", async (req, res) => {
    const result = {};
    console.log("RUNNING /BPCK");
    console.log("////////////\n\nreq.body data received: ", req.body);
    const name = req.body.nameHolder;

    try {
        console.log(" Enter /bpck try block for concept ", name);
        await axios
            .get("https://rxnav.nlm.nih.gov/REST/drugs.json?name=" + name)
            .then((response) => {
                return response.data;
            })
            .then((data) => {
                console.log(
                    "Logging response.json:*******************************************************************"
                );
                console.log(data);
                console.log("Axios has been run.", JSON.stringify(data));

                console.log(
                    "/bpck --> ttyConcepts for " + name + " -->",
                    data,
                    "<-- tty concepts for " + name
                );
                console.log(
                    "/// result: data.drugGroup.conceptGroup/// \n\n",
                    data.drugGroup.conceptGroup
                );
                res.send({
                    result: data.drugGroup.conceptGroup[0].conceptProperties,
                });
            });
    } catch (error) {
        console.log(
            "ERROR running fetch /allconcepts where tty equals " + rxcui + ".",
            error
        );
    }
});

app.post("/gpck", async (req, res) => {
    const result = {};
    console.log("RUNNING /GPCK");
    console.log("////////////\n\nreq.body data received: ", req.body);
});

app.post("/sbd", async (req, res) => {
    const result = {};
    console.log("RUNNING /SBD");
    console.log("////////////\n\nreq.body data received: ", req.body);
    const name = req.body.nameHolder;

    try {
        console.log(" Enter /sbd try block for concept ", name);
        await axios
            .get("https://rxnav.nlm.nih.gov/REST/drugs.json?name=" + name)
            .then((response) => {
                return response.data;
            })
            .then((data) => {
                res.send({
                    result: data.drugGroup.conceptGroup[2].conceptProperties,
                });
            });
    } catch (error) {
        console.log(
            "ERROR running fetch /allconcepts for " + name + ".",
            error
        );
    }
});

app.post("/scd", async (req, res) => {
    const result = {};
    console.log("RUNNING /SCD");
    console.log("////////////\n\nreq.body data received: ", req.body);
});

app.post("/allProperties", async (req, res) => {
    const result = {};
    console.log("req.body data received: ", req.body);
    console.log("^^^ What you posted to /allProperties");

    const bookData = req.body.bookData;
    console.log("bookData >>>", bookData, "<<< bookData");

    if (bookData && bookData.length) {
        var data = await createAllProperties(bookData, 0, []);
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify(data));
    } else {
        var response = {
            message: "require ID,",
        };
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify(response));
    }
});

// app.post("/conceptProperties", async (req, res) => {
//     const result = {};
//     console.log("req.body data received: ", req.body);
//     console.log("^ WHAT you sent to /termTypes in the req.body}");
//     // try {
//     const bookData = req.body.bookData;
//     console.log(bookData);

//     if (bookData && bookData.length) {
//         var data = await createConceptProperty(bookData, 0, []);
//         res.setHeader("content-type", "application/json");
//         res.send(JSON.stringify(data));
//     } else {
//         var resposnse = {
//             message: "required Id",
//         };
//         res.setHeader("content-type", "application/json");
//         res.send(JSON.stringify(resposnse));
//     }
// });

app.post("/termTypes", (req, res) => {
    const result = {};
    console.log("req.body data received: ", req.body);
    console.log("^ WHAT you sent to /termTypes in the req.body}");
    try {
        const bookData = req.body.bookData;
        const termType = bookData.termTypeList.termType;
        const searchQuery = req.body.searchQuery;
        console.log("//////");
        console.log("bookdata: ", bookData);
        console.log('^This is the "bookData" the JSON is trynna parse');
        console.log("termType --> ", termType, " <-- termType");

        // termType.forEach((tty) => {
        //     console.log("CURRENT TTY: " + tty);
        //     getAllConceptsByTTY(tty);
        // });

        getAllConceptsByTTY("BN");
        getAllConceptsByTTY("IN");
        getAllConceptsByTTY("MIN");
        getAllConceptsByTTY("GPCK");
        getAllConceptsByTTY("SBD");
        getAllConceptsByTTY("BPCK");

        // const conceptCuis = readAllMinConcepts();
        // conceptCuis.forEach((concept) => {
        //     insertConceptProperties(concept);
        // });
        // x;

        result.success = true;
    } catch (e) {
        console.log("Did not post to /termTypes");
        console.error(`Failed to connect: ${e}`);
        result.success = false;
    } finally {
        console.log("result", result);
        res.send(JSON.stringify(result));
    }
});

let createAllProperties = (ids, i, meds) => {
    let rxnavPropertiesURL =
        "https://rxnav.nlm.nih.gov/REST/rxcui/{0}/allProperties.json?prop=CODES";
    if (i < ids.length) {
        let id = ids[i++];
        let url = rxnavPropertiesURL.replace("{0}", id.rxcui);
        // console.log("Search rxnav for " + id.rxcui + " @ " + url);
        return fetch(url)
            .catch((err) =>
                console.log(
                    "\x1b[31m createAllProperties error in fatch -----",
                    err
                )
            )
            .then((response) => response.json())
            .then(async (result) => {
                console.log("then((restult) => result)");
                console.log(
                    JSON.stringify(result.propConceptGroup.propConcept)
                );
                if (
                    result &&
                    result.propConceptGroup &&
                    result.propConceptGroup.propConcept &&
                    result.propConceptGroup.propConcept.length > 0
                ) {
                    // console.log(
                    //     "resut...propName   . " +
                    //         result.propConceptGroup.propConcept.propName
                    // );
                    meds.push(result);
                    console.log(
                        "*** result.propValue *** \n" +
                            JSON.stringify(result.propConceptGroup.propConcept)
                    );

                    await insertAllProperties(
                        id.rxcui,
                        result.propConceptGroup.propConcept,
                        (cb) => {
                            cb;
                        }
                    );
                }
                return createAllProperties(ids, i, meds);
            });
    }
    return new Promise((a, r) => a(meds));
    // meds = final array of all the response
};

// async function createConceptProperty(rxcui) {
//     try {
//         console.log(
//             "////// createConceptProperty(rxcui) try block START //////"
//         );
//         console.log("running createConceptProperty(" + rxcui + ")");
//         var conceptPropertiesObj = await axios
//             .get(
//                 "https://rxnav.nlm.nih.gov/REST/rxcui/" +
//                     rxcui +
//                     "/properties.json"
//             )
//             .then((response) => {
//                 console.log(
//                     ".:/// Logging response.data for " + rxcui + " ///:."
//                 );
//                 console.log(response);
//                 console.log(
//                     "^^^ /// Above is response.data for " + rxcui + " /// ^"
//                 );
//             });

//         // .then((data) => {
//         //     console.log(
//         //         ".:/// Logging response.data for " + rxcui + " ///:."
//         //     );
//         //     console.log(data);
//         //     console.log(
//         //         "^^^ /// Above is response.data for " + rxcui + " /// ^"
//         //     );
//         // });
//     } catch (error) {
//         console.log(
//             "Error running createConceptProperty(" + rxcui + "): ",
//             error
//         );
//     }
// }

async function readAllMinConcepts() {
    try {
        const results = await client.query("SELECT rxcui FROM search_concepts");
        return results.rows;
    } catch (e) {
        console.log("Cannot read Book Queries and run rABQ in backend");
        console.log("Here is MY serach result------------------------------");
        return [];
    }
}

async function searchFilledDatabase(search) {
    console.log("RUNNING searchFilledDatabase(" + search + ")");
    try {
        console.log(".: searchFilledDatabase(" + search + ") TRY BLOCK :.");
        const results = await client.query(
            "SELECT *,LENGTH (Name) len FROM concept_properties WHERE name LIKE '" +
                search +
                "%' ORDER BY len ASC"
        );
        console.log("result.rows 14441111111111111********--> ");
        return results.rows;
    } catch (error) {
        console.log(".: searchFilledDatabase(" + search + ") ERROR BLOCK :.");
        console.log(
            "Cannot run searchFilledDatabase(" + search + ") function",
            error
        );
        return [];
    }
}

async function getAllConceptsByTTY(tty) {
    console.log(
        "/////// THE FOLLOWING TTY: ",
        tty,
        " HAS THE BELOW CONCEPTS //////"
    );

    try {
        console.log(" Enter getAllConceptsByTTY(" + tty + ") try block ");
        var ttyConcepts = await axios
            .get("https://rxnav.nlm.nih.gov/REST/allconcepts.json?tty=" + tty)
            .then((response) => {
                // console.log("responce ---------",response)
                return response.data.minConceptGroup.minConcept;
            })
            .then((data) => {
                console.log(
                    "Logging response.json:*******************************************************************"
                );
                console.log(data);
                console.log("^ response.json for /allconcepts?tty=" + tty);
                console.log("Axios has been run.", data);

                console.log(
                    "get allConceptsFor... --> ttyConcepts for " + tty + " -->",
                    data,
                    "<-- tty concepts for " + tty
                );
                createTTYQuery(data);
                console.log("////// DATA RETRIEVED for " + tty + " ^ //////");
                console.log(
                    " Will now exit getAllConceptsByTTY(" + tty + ") try block "
                );
            });
    } catch (error) {
        console.log(
            "ERROR running fetch /allconcepts where tty equals " + tty + ".",
            error
        );
    }

    console.log(
        "/////// THE FOLLOWING TTY: ",
        tty,
        " HAS THE ABOVE CONCEPTS //////"
    );
    console.log(".: SUCCESFULLY SENT to /allconcepts:.");
}

//Function for inserting an entry into the "search_queries" table
async function createTTYQuery(minConcept) {
    const result = {};
    // data = JSON.parse(minConcept);

    try {
        // await client.query();

        console.log("////// createTTYQuery(minConcept) try block START//////");
        console.log(
            "The following minConcept was the passed into createTTYQuery(minConcept)",
            minConcept,
            "^^^ That was the minConcept passed into createTTYQuery(minConcept)"
        );

        console.log("//////COMMENCE FOREACH PROCESS//////");
        minConcept.forEach((concept) => {
            insertMinConcept(concept);
        });
        result.success = true;
        console.log("//////TERMINATE FOREACH PROCESS//////");
        console.log("////// createTTYQuery(minConcept) try block END//////");
    } catch (error) {
        console.log("Did not run forEach successfully");
        console.error(`Failed to connect: ${error}`);
    } finally {
        console.log("result", result);
    }
}

// Function for inserting an entry into the "all_concepts" table in the rxnorm_ui database
async function insertMinConcept(concept) {
    console.log(
        "running insertMinConcept(concept) for " + JSON.stringify(concept)
    );
    try {
        await client.query(
            "INSERT INTO search_concepts(rxcui, name, tty) values($1, $2, $3)",
            [concept.rxcui, concept.name, concept.tty]
        );
        console.log(
            "successfully ran insertMinConcept(concept) for " +
                concept.tty +
                " concept " +
                concept.name
        );
        return true;
    } catch (error) {
        console.log(
            "problem running insertMinConcept(concept) for " + concept.tty,
            error
        );
        return false;
    }
}

// Function for inserting an entry into the "all_properties" table in the rxnorm_ui database

async function insertAllProperties(rxcui, concept, cb) {
    console.log("insertAllProperties(x, x) rxcui: ", rxcui);
    console.log(
        "running insertConceptProperties(concept) for " +
            JSON.stringify(concept)
    );
    async.forEach(
        concept,
        (concept, cb1) => {
            try {
                console.log(
                    "\n\n\n\n insertAllProperties(" +
                        JSON.stringify(concept) +
                        ") try block"
                );
                client.query(
                    "INSERT INTO all_properties(rxcui, property_category, property_name, property_value) values($1, $2, $3, $4)",
                    [
                        rxcui,
                        concept.propCategory,
                        concept.propName,
                        concept.propValue,
                    ]
                );
                console.log(
                    "successfully ran insertAllProperties(concept) for " +
                        concept.propName +
                        ", value: " +
                        concept.propValue
                );
                cb1();
            } catch (error) {
                console.log(
                    "\x1b[31m problem running insertMinConcept(concept) for " +
                        concept,
                    error
                );
                cb1(error);
            }
        },
        function (cb) {
            return new Promise((a, r) => a(cb));
        }
    );
}

// Function for inserting an entry into the "all_concepts" table in the rxnorm_ui database

async function insertConceptProperties(concept) {
    console.log(
        "running insertConceptProperties(concept) for " +
            JSON.stringify(concept.rxcui)
    );
    const properties = concept;
    // var query = "INSERT INTO concept_properties(rxcui, name, synonym, tty, language, suppress, umlscui) values($1, $2, $3, $4, $5, $6, $7)",

    try {
        await client.query(
            "INSERT INTO concept_properties(rxcui, name, synonym, tty, language, suppress, umlscui) values($1, $2, $3, $4, $5, $6, $7)",
            [
                properties.rxcui,
                properties.name,
                properties.synonym,
                properties.tty,
                properties.language,
                properties.suppress,
                properties.umlscui,
            ]
        );
        console.log(
            "successfully ran insertConceptProperties(concept) for " +
                concept.tty +
                " concept " +
                concept.name
        );
        return true;
    } catch (error) {
        console.log(
            "problem running insertMinConcept(concept) for " + concept.tty,
            error
        );
        return false;
    }
}

app.listen(PORT);

console.log("Listening on port:", PORT);

// TO BE USED LATER

// async function readAllBookQueries() {
//     try {
//         const results = await client.query(
//             "SELECT search_query, title, author FROM search_queries_2"
//         );
//         return results.rows;
//     } catch (e) {
//         console.log("Cannot read Book Queries and run rABQ in backend");
//         console.log(e);
//         return [];
//     }
// }
