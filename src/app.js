import express from 'express';
// import tasksRouter from './routes/tasks.js';

import products from "./data/products.js";
import users from "./data/users.js";
import { engine } from "express-handlebars";
import path from "path";
import hbs from "hbs";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.engine("handlebars", engine());

app.set("view engine", "handlebars");
hbs.registerPartials(__dirname + "/views/partials");

app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "../public")));

app.use(express.json());
//app.use(express.urlencoded({extended: true}));

app.use(
    session({
        secret: process.env.SESSION_SECRET || 'secret',
        resave: false,
        saveUninitialized: false
    })
);

// app.use('./tasks', tasksRouter);


//    --- Get ---    //


app.get("/", (req, res) => {
    if (!req.session.user) { return res.redirect('/login'); }
    res.render("home", {title: "Main page", name: "Timofey"});
});

app.get("/about", (req, res) => {
    res.render("about", {title: "About us", description: "Internet store"});
});

app.get("/products", (req, res) => {
    res.render("products", {title: "Products", products: products});
});

app.get("/products/cheap", (req, res) => {
    const cheapProducts = products.filter(
        product => product.price < 3000
    );

    res.render("products", {title: "Products<3000", products: cheapProducts});
});

app.get("/products/sorted", (req, res) => {
    const sortedProducts = [...products].sort(
        (a, b) => a.price - b.price
    );

    res.render("products", {title: "Sorted products", products: sortedProducts});
});

app.get("/products/:id", (req, res) => {
    const productId = Number(req.params.id);

    const product = products.find(
        item => item.id === 2
    );

    if (!product) {
        return res.status(404).send("Product not found");
    }

    res.render("product", {title: product.name, product});
});

app.get("/register", (req, res) => {
    res.render("register", {title: "Register", error: null});
});

app.get("/login", (req, res) => {
    res.render("login", {title: "Login", error: null});
});


//    --- Post ---    //


app.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const user = users.find(
        (item) =>
            item.email.toLowerCase() === email.toLowerCase() &&
            item.password === password
    );

    if (!user) {
        return res.render('login', {title: 'Login', error: 'Email or password'});
    }

    req.session.user = {
        username: user.username,
        email: user.email
    };

    res.redirect('/');
});

app.post('/register', (req, res) => {
    const { name, email, password, repeatPawword } = req.body;

    if (!name || !email || !password || !repeatPawword) {
        return res.render('register', {title: 'register', error: 'Заполните все поля'});
    }

    if (password !== repeatPawword) {
        return res.render('register', {title: 'register', error: 'Пароли не совпадают'});
    }

    const userExists = user.some(
        (user) => user.email.toLowerCase() === email.toLowerCase()
    );

    if (userExists) {
        return res.render('register', {title: 'register', error: 'Пользователь с таким email уже существует'});
    }

    users.push({
        name,
        email: email.toLowerCase(),
        password
    });

    res.redirect('/login');
});

export default app;