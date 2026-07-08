import type {Request, Response} from "express";
import { UserService } from "./user.service";

export class UserController {
    constructor( private userService: UserService) {}

    register = async (req: Request, res: Response) => {
        try {
            const {name, email} = req.body;

            if (!name || !email) {
                return res.status(400).json({
                    message: "Name and email are required",
                });
            }

            const result = await this.userService.registerUser({
                name,
                email,
            });

            return res.status(201).json({
                message: "USer registered successfully",
                data: result,
            });
        } catch (error) {
            console.error("Register error:", error);

            return res.status(500).json({
                message: "Something went wrong",
            });
        }
    };
}

