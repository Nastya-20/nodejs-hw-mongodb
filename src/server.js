import express from "express";
import cors from "cors";
import pino from "pino-http";
import { env } from "./utils/env.js";
import * as contactServices from "./services/contacts.js";

export const setupServer = () => {
    const app = express();

    app.use(cors());
    const logger = pino({
        transport: {
            target: "pino-pretty"
        }
    });
    app.use(logger);

    app.get("/contacts", async (req, res, next) => {
        try {
            const data = await contactServices.getContacts();
            res.status(200).json({
                status: 200,
                message: "Successfully found contacts",
                data,
            });
        } catch (error) {
            next(error);
        }
    });

  app.get("/contacts/:contactId", async (req, res, next) => {
    try {
        const { contactId } = req.params;
        const data = await contactServices.getContactById(contactId);

        if (!data) {
            return res.status(404).json({
                status: 404,
                message: `Contact with id=${contactId} not found`,
            });
        }
        res.status(200).json({
            status: 200,
            message: "Contact successfully found",
            data,
        });
    } catch (error) {
        next(error);
    }
});

    app.use((req, res) => {
        res.status(404).json({
            status: 404,
            message: `${req.url} not found`,
        });
    });

    app.use((error, req, res, next) => {
        console.error("Error:", error.message);
        res.status(500).json({
            status: 500,
            message: error.message,
        });
    });

    const port = Number(env("PORT", 3000));
    app.listen(port, () => console.log(`Server running on port ${port}`));
};

