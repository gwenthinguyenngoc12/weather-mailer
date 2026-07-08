import express from "express";
import cors from "cors";
import {userRoutes} from ""
export const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Weather Mailer API iss running");
});

app.use ("/api/users, userRoutes")