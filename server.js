import 'dotenv/config';

import express from "express";
const port = process.env.PORT;

const app = express();

app.use((req, res, next) => {
    console.log("Запрос пришел");
    next();
});

app.use((req, res, next) => {
    console.log("Проверяем запрос");
    next();
});

app.use((req, res, next) => {
    const isAllowed = true;

    if (!isAllowed) {
        return res.status(403).send("Dostup zapreschen");
    }

    next();
});

app.get("/", (req, res) => {
    console.log("Отправляем ответ");
    res.send("Main page");
});

app.get("/products", (req, res) => {
    res.send("Product list");
});

app.post("/products", (req, res) => {
    res.send("Add product");
});

app.delete("/products", (req, res) => {
    res.send("Delete products")
});

app.get("/about", (req, res) => {
    res.send("Info about company");
});

app.get("/user", (req, res) => {
    res.json({
        id: 1,
        name: "Anna",
        role: "student"
    });
});

app.listen(3000, () => {
    console.log("Server started");
});