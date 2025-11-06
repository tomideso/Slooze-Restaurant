import type { Request, RequestHandler, Response } from "express";

import { restaurantService } from "@/api/restaurant/restaurantService";

class RestaurantController {
  public getRestaurants: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await restaurantService.findAll();
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public getRestaurant: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await restaurantService.findById(req.params.id);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public createRestaurant: RequestHandler = async (req: Request, res: Response) => {
    const restaurantData = req.body;
    const serviceResponse = await restaurantService.create(restaurantData);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };
}

export const restaurantController = new RestaurantController();
