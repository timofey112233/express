import express from 'express';
// import tasksRouter from './routes/tasks.js';

import products from "./data/products.js";
import users from "./data/users.js";
import { engine } from "express-handlebars";
import path from "path";
import hbs from "hbs";
import session from "express-session"
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

import bcrypt from 'bcryptjs';
import User from './models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();


//    --- Set & Use ---    //


app.engine("handlebars", engine());

app.set("view engine", "handlebars");
hbs.registerPartials(__dirname + "/views/partials");

app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "../public")));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

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
    res.render("home", {title: "Main page", name: req.session.user.name});
});

app.get("/about", (req, res) => {
    res.render("about", {title: "About us", description: "Internet store"});
});

app.get("/products", (req, res) => {
    if (!req.session.user) { return res.redirect('/login'); }
    res.render("products", {title: "Products", products: products});
});

app.get("/users", (req, res) => {
    if (!req.session.user) { return res.redirect('/login'); }
    res.render("users", {title: "Users", users: users});
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
    if (!req.session.user) { return res.redirect('/login'); }
    const productId = Number(req.params.id);

    const product = products.find(
        item => item.id === productId
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

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({
            where: { email }
        });
      
        if (!user) {
            return res.render('login', {
                title: 'Вход',
                error: 'Неверный email или пароль.'
            });
        }
      
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );
      
        if (!isPasswordCorrect) {
            return res.render('login', {
                title: 'Вход',
                error: 'Неверный email или пароль.'
            });
        }
      
        req.session.user = {
            id: user.id,
            username: user.username,
            email: user.email
        };
      
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Ошибка сервера.');
    } 
});

app.post('/register', async (req, res) => {
    const { name, email, password, repeatPassword } = req.body;

    if (!name || !email || !password || !repeatPassword) {
        return res.render('register', {title: 'register', error: 'Заполните все поля'});
    }

    if (password !== repeatPassword) {
        return res.render('register', {title: 'register', error: 'Пароли не совпадают'});
    }

    try {
        await User.create({
            username: name,
            email: email,
            password: password
        });

        res.redirect('/login');
    } catch(error) {
        console.log(error);
        let message = 'Не удалось зарегистрироватся';

        if (error.username === 'SequalizeUniqueConstraintError') {
            if (error.errors.some(item => item.path === 'name')) {
                message = 'Такое имя уже занято';
            } else if (error.errors.some(item => item.path === 'email')) {
                message = 'Пользователь с таким email уже существует';
            } else if (error.username === 'SequelizeValidationError') {
                message = error.errors.map(item => item.message).join(' ');
            }
        }

        res.render('register', {title: 'register', error: message});
    }
});

export default app;