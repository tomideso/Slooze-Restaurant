import { StatusCodes } from "http-status-codes";
import { mongo } from "mongoose";
import { CartRepository, type CartRepositoryType } from "@/api/cart/cartRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import type { Cart, UpdateCartSchema } from "./cartModel";

type CartItem = Cart["items"];

export class CartService {
  private cartRepository: CartRepositoryType;

  constructor(repository = CartRepository) {
    this.cartRepository = repository;
  }

  // Retrieves cart for logged in user or by cartId
  async findCart(userId?: string, cartId?: string): Promise<ServiceResponse<Cart | null>> {
    try {
      let cart: Cart | null;

      if (cartId) {
        cart = await this.cartRepository.findById(cartId).lean();
      } else {
        cart = await this.cartRepository.findOne({ user: userId }).lean();
      }
      if (!cart) {
        return ServiceResponse.failure("No Cart found", null, StatusCodes.NOT_FOUND);
      }

      return ServiceResponse.success<Cart>("Cart found", cart);
    } catch (ex) {
      const errorMessage = `Error cart: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving cart.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Creates a new cart
  async create({ userId, items = [] }: { userId: string; items?: CartItem }): Promise<ServiceResponse<Cart | null>> {
    try {
      const menuItemIds = items.map(({ menuItem }) => new mongo.ObjectId(menuItem as string));
      const itemsWithQuantity = items.filter(({ quantity }) => quantity > 0);

      const cart = await this.cartRepository.findOneAndUpdate(
        { user: userId },
        //update incase items is passed in
        [
          {
            $set: {
              items: {
                $filter: {
                  input: "$items",
                  as: "item",
                  cond: { $in: ["$$item.menuItem", menuItemIds] }, // Condition to keep elements
                },
              },
            },
          },
          { $set: { items: { $concatArrays: ["$items", itemsWithQuantity] } } },
        ],
        { new: true }
      );

      if (cart) {
        //add items to cart
        return ServiceResponse.success<Cart>("Cart found", cart);
      }

      const newCart = new this.cartRepository({ user: userId, items });
      await newCart.save();

      return ServiceResponse.success<Cart>("Menu Item created successfully", newCart, StatusCodes.CREATED);
    } catch (ex) {
      const errorMessage = `Error creating menu item: ${(ex as Error).message}`;
      console.error(ex);
      return ServiceResponse.failure(
        "An error occurred while creating menu item.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  //Updates an cart item
  async update(userId: string, items: CartItem): Promise<ServiceResponse<Cart | null>> {
    let transformedItems: Record<string, { id: mongo.ObjectId; quantity: number }> = {};

    transformedItems = items.reduce((acc, currentValue) => {
      acc[currentValue.menuItem as string] = {
        id: new mongo.ObjectId(currentValue.menuItem as string),
        quantity: Math.max(0, currentValue.quantity),
      };

      return acc;
    }, transformedItems);

    //account for zero quantity

    try {
      const updatedCart = await this.cartRepository.findOneAndUpdate(
        { user: userId },
        [
          {
            $addFields: {
              transformedItems, // Embed the entire object
            },
          },
          {
            $set: {
              items: {
                $map: {
                  input: "$items",
                  as: "item",
                  in: {
                    $cond: [
                      {
                        $eq: [
                          { $toObjectId: "$$item.menuItem" },
                          {
                            $toObjectId: {
                              $getField: {
                                field: "id",
                                input: {
                                  $getField: {
                                    input: "$transformedItems",
                                    field: { $toString: "$$item.menuItem" },
                                  },
                                },
                              },
                            },
                          },
                        ],
                      },
                      {
                        $cond: [
                          {
                            $eq: [
                              {
                                $toInt: {
                                  $getField: {
                                    field: "quantity",
                                    input: {
                                      $getField: {
                                        input: "$transformedItems",
                                        field: { $toString: "$$item.menuItem" },
                                      },
                                    },
                                  },
                                },
                              },
                              0,
                            ],
                          },
                          null, //remove item if quantity is zero
                          {
                            $mergeObjects: [
                              "$$item",
                              {
                                quantity: {
                                  $toInt: {
                                    $getField: {
                                      field: "quantity",
                                      input: {
                                        $getField: {
                                          input: "$transformedItems",
                                          field: { $toString: "$$item.menuItem" },
                                        },
                                      },
                                    },
                                  },
                                },
                              },
                            ],
                          },
                        ],
                      },
                      "$$item",
                    ],
                  },
                },
              },
            },
          },
          {
            $set: {
              items: {
                $filter: {
                  input: "$items",
                  as: "item",
                  cond: { $ne: ["$$item", null] }, // Filter out null values
                },
              },
            },
          },
          { $unset: ["transformedItems"] },
        ],
        { new: true }
      );

      if (!updatedCart) {
        return ServiceResponse.failure("Cart not found", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<Cart>("Cart updated successfully", updatedCart);
    } catch (ex) {
      const errorMessage = `Error updating cart: ${(ex as Error).message}`;
      console.error(ex);
      return ServiceResponse.failure("An error occurred while updating cart", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  //Deletes cart
  async delete(userId: string): Promise<ServiceResponse<null>> {
    try {
      const deletedCart = await this.cartRepository.findOneAndDelete({ user: userId });
      if (!deletedCart) {
        return ServiceResponse.failure("Cart not found", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<null>("Cart successfully", null);
    } catch (ex) {
      const errorMessage = `Error deleting Cart : ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("An error occurred while deleting Cart.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export const cartService = new CartService();
