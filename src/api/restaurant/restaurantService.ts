import { StatusCodes } from "http-status-codes";

import type { Restaurant } from "@/api/restaurant/restaurantModel";
import { RestaurantRepository } from "@/api/restaurant/restaurantRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";

export class RestaurantService {
  private restaurantRepository: typeof RestaurantRepository;

  constructor(repository: typeof RestaurantRepository = RestaurantRepository) {
    this.restaurantRepository = repository;
  }

  // Retrieves all restaurants from the database
  async findAll(): Promise<ServiceResponse<Restaurant[] | null>> {
    try {
      const restaurants = await this.restaurantRepository.find();
      if (!restaurants || restaurants.length === 0) {
        return ServiceResponse.failure("No Restaurants found", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<Restaurant[]>("Restaurants found", restaurants);
    } catch (ex) {
      const errorMessage = `Error finding all restaurants: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("An error occurred while retrieving restaurants.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  // Retrieves a single restaurant by its ID
  async findById(id: Restaurant["_id"]): Promise<ServiceResponse<Restaurant | null>> {
    try {
      const restaurant = await this.restaurantRepository.findById(id);
      if (!restaurant) {
        return ServiceResponse.failure("Restaurant not found", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<Restaurant>("Restaurant found", restaurant);
    } catch (ex) {
      const errorMessage = `Error finding restaurant with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("An error occurred while finding restaurant.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  // Creates a new restaurant
  async create(data: Omit<Restaurant, "_id">): Promise<ServiceResponse<Restaurant | null>> {
    try {
      delete (data as Partial<Restaurant>)._id; // Ensure _id is not set
      const newRestaurant = await this.restaurantRepository.create(data);
      return ServiceResponse.success<Restaurant>("Restaurant created", newRestaurant);
    } catch (ex) {
      const errorMessage = `Error creating restaurant: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("An error occurred while creating restaurant.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export const restaurantService = new RestaurantService();
