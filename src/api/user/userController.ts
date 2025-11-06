import type { Request, RequestHandler, Response } from "express";

import { userService } from "@/api/user/userService";

class UserController {
  public async registerUser(req: Request, res: Response) {
    const serviceResponse = await userService.register(req.body);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  }

  public async loginUser(req: Request, res: Response) {
    const serviceResponse = await userService.login(req.body.email, req.body.password);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  }
}

export const userController = new UserController();
