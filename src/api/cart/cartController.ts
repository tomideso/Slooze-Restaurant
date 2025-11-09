import type { Request, RequestHandler, Response } from "express";
import type { User } from "../user/userModel";
import { cartService } from "./cartService";

class CartController {
  public getCart: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await cartService.findCart((<User>req.user)._id, req.params.cartId);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public createCart: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await cartService.create({ userId: (<User>req.user)._id, items: req.body.items });
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public updateCart: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await cartService.update((<User>req.user)._id, req.body.items);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public deleteCart: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await cartService.delete((<User>req.user)._id);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };
}

export const cartController = new CartController();
