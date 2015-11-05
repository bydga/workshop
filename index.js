//modul pro webovou aplikaci
var express = require("express")
//modul pro parsování HTTP POST body
var bodyParser = require("body-parser")
//helper modul pro práci s cestami
var path = require("path")



//náš vlastní modul pro práci s databází ze složky lib/
var database = require("./lib/database")



// port na kterém bude aplikace poslouchat
var port = 8090
console.log("Starting jsdnfjsidnfjibs app...")

// vytvoření konkrétní express.js aplikace
var app = express()

// nastavíme jade jako renderovací engine pro tuhle express aplikaci a řekneme, kde jsou šablony
app.set('views', './views')
app.set('view engine', 'jade')


// middleware pro parsování HTTP POST pořadavků
app.use(bodyParser.urlencoded({extended: true}))

// middleware pro servírování statických souborů
app.use(express.static(path.join(__dirname, "public")))

// homepage (GET) routa
app.get("/", (req, res) => {
    // .render říká, jaká (jade) šablona se má použít pro vyrenderování této routy
    res.render("main")
})

// GET routa pro získání všech uživatelů (volána z aplikace AJAXem)
app.get("/users/list", (req, res) => {

    database.getAllUsers((err, users) => {
        if (err)
            return res.json({error: err})
        res.json(users)
    })
})



// ukázková GET routa
app.get("/test", (req, res) => {
    res.json({hello:{"i-am": "here"}})
})


// POST routa pro uložení nového uživatele (volána z aplikace AJAXem)
app.post("/users/add", (req, res) => {

    var user = {
        username: req.body.username,
        email: req.body.email,
        fullname: req.body.fullname,
        age: req.body.age,
        location: req.body.location,
        gender: req.body.gender
    }

    database.insertUser(user, (err) => {
        if (err)
            res.json({error: err})
        else
            res.json({result: "ok"})
    })
})

// DELETE routa pro smazání uživatele (volána z aplikace AJAXem)
app.delete("/users/delete/:id", (req, res) => {
    var userId = req.params.id
    database.deleteUserById(userId, (err) => {
        if (err)
            res.json({error: err})
        else
            res.json({result: "ok"})
    })
})


//apliakce začíná poslouchat na specifikovaném portu - odteď je živá
app.listen(port, () => {
    console.log("App listening on ", port)
})


