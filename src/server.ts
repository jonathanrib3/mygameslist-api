import express, { json } from "express";

const app = express();

app.use(json());

app.get("/", (request, response) =>
  response.status(200).send({ message: "Welcome!!" })
);

app.listen(3000, () => {
  console.log("Server running on http://localhost/3000");
});
