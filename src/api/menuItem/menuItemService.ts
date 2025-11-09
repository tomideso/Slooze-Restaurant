import { StatusCodes } from "http-status-codes";
import type { MenuItem } from "@/api/menuItem/menuItemModel";
import { MenuItemRepository } from "@/api/menuItem/menuItemRepository";
import type { Restaurant } from "@/api/restaurant/restaurantModel";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";

export class MenuItemService {
	private menuItemRepository;

	constructor(repository = MenuItemRepository) {
		this.menuItemRepository = repository;
	}

	// Retrieves all menu items from the database
	async findAll(): Promise<ServiceResponse<MenuItem[] | null>> {
		try {
			const menuItems = await this.menuItemRepository.find();
			if (!menuItems || menuItems.length === 0) {
				return ServiceResponse.failure("No Menu Items found", null, StatusCodes.NOT_FOUND);
			}
			return ServiceResponse.success<MenuItem[]>("Menu Items found", menuItems);
		} catch (ex) {
			const errorMessage = `Error finding all menu items: $${(ex as Error).message}`;
			logger.error(errorMessage);
			return ServiceResponse.failure(
				"An error occurred while retrieving menu items.",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}

	// Retrieves a single menu item by its ID
	async findById(id: MenuItem["_id"]): Promise<ServiceResponse<MenuItem | null>> {
		try {
			const menuItem = await this.menuItemRepository.findById(id);
			if (!menuItem) {
				return ServiceResponse.failure("Menu Item not found", null, StatusCodes.NOT_FOUND);
			}
			return ServiceResponse.success<MenuItem>("Menu Item found", menuItem);
		} catch (ex) {
			const errorMessage = `Error finding menu item with id ${id}:, ${(ex as Error).message}`;
			logger.error(errorMessage);
			return ServiceResponse.failure(
				"An error occurred while finding menu item.",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}

	//Retrieves menu items by restaurant ID
	async findByRestaurantId(restaurantId: Restaurant["_id"]): Promise<ServiceResponse<MenuItem[] | null>> {
		try {
			const menuItems = await this.menuItemRepository.find({ restaurant: restaurantId });
			if (!menuItems || menuItems.length === 0) {
				return ServiceResponse.failure("No Menu Items found for this Restaurant", null, StatusCodes.NOT_FOUND);
			}
			return ServiceResponse.success<MenuItem[]>("Menu Items found", menuItems);
		} catch (ex) {
			const errorMessage = `Error finding menu items for restaurant with id ${restaurantId}:, ${(ex as Error).message}`;
			logger.error(errorMessage);
			return ServiceResponse.failure(
				"An error occurred while finding menu items.",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}

	// Creates a new menu item
	async create(
		menuItemData: Omit<Partial<MenuItem>, "id" | "createdAt" | "updatedAt">,
	): Promise<ServiceResponse<MenuItem | null>> {
		try {
			delete menuItemData._id;

			const newMenuItem = await this.menuItemRepository.create(menuItemData);
			return ServiceResponse.success<MenuItem>("Menu Item created successfully", newMenuItem, StatusCodes.CREATED);
		} catch (ex) {
			const errorMessage = `Error creating menu item: ${(ex as Error).message}`;
			logger.error(errorMessage);
			return ServiceResponse.failure(
				"An error occurred while creating menu item.",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}

	//Updates an existing menu item
	async update(id: MenuItem["_id"], menuItemData: Partial<MenuItem>): Promise<ServiceResponse<MenuItem | null>> {
		try {
			delete menuItemData._id;

			const updatedMenuItem = await this.menuItemRepository.findByIdAndUpdate(
				id,
				{ $set: menuItemData },
				{ new: true },
			);
			if (!updatedMenuItem) {
				return ServiceResponse.failure("Menu Item not found", null, StatusCodes.NOT_FOUND);
			}
			return ServiceResponse.success<MenuItem>("Menu Item updated successfully", updatedMenuItem);
		} catch (ex) {
			const errorMessage = `Error updating menu item with id ${id}: ${(ex as Error).message}`;
			logger.error(errorMessage);
			return ServiceResponse.failure(
				"An error occurred while updating menu item.",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}

	//Deletes a menu item
	async delete(id: MenuItem["_id"]): Promise<ServiceResponse<null>> {
		try {
			const deletedMenuItem = await this.menuItemRepository.findByIdAndDelete(id);
			if (!deletedMenuItem) {
				return ServiceResponse.failure("Menu Item not found", null, StatusCodes.NOT_FOUND);
			}
			return ServiceResponse.success<null>("Menu Item deleted successfully", null);
		} catch (ex) {
			const errorMessage = `Error deleting menu item with id ${id}: ${(ex as Error).message}`;
			logger.error(errorMessage);
			return ServiceResponse.failure(
				"An error occurred while deleting menu item.",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}
}

export const menuItemService = new MenuItemService(MenuItemRepository);
