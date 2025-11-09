import type { Request, RequestHandler, Response } from "express";
import type { MenuItem } from "@/api/menuItem/menuItemModel";

import { menuItemService } from "@/api/menuItem/menuItemService";

class MenuItemController {
	public getMenuItems: RequestHandler = async (_req: Request, res: Response) => {
		const serviceResponse = await menuItemService.findAll();
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public getMenuItem: RequestHandler = async (req: Request, res: Response) => {
		const serviceResponse = await menuItemService.findById(req.params.id);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public getMenuItemsByRestaurant: RequestHandler = async (req: Request, res: Response) => {
		const serviceResponse = await menuItemService.findByRestaurantId(req.params.restaurantId);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public createMenuItem: RequestHandler = async (req: Request, res: Response) => {
		const menuItemData = req.body;
		const serviceResponse = await menuItemService.create(menuItemData);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public updateMenuItem: RequestHandler = async (req: Request, res: Response) => {
		const id = req.params.id as MenuItem["_id"];
		const menuItemData = req.body;
		const serviceResponse = await menuItemService.update(id, menuItemData);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public deleteMenuItem: RequestHandler = async (req: Request, res: Response) => {
		const id = req.params.id as MenuItem["_id"];
		const serviceResponse = await menuItemService.delete(id);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};
}

export const menuItemController = new MenuItemController();
