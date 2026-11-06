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

// app.use('./tasks', tasksRouter);

app.get("/", (req, res) => {
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
    res.render("register", {title: "Register"});
});

app.get("/login", (req, res) => {
    res.render("login", {title: "Login"});
});

export default app;