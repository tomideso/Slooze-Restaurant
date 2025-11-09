import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import type { User } from "@/api/user/userModel";
import { UserRepository } from "@/api/user/userRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { env } from "@/common/utils/envConfig";
import { logger } from "@/server";

type Token<T> = Partial<T> & {
	token: string;
};

export class UserService {
	private userRepository;

	constructor(repository = UserRepository) {
		this.userRepository = repository;
	}

	//Register a user
	public async register(user: User): Promise<ServiceResponse<User | null>> {
		try {
			const newUser = new UserRepository({
				username: user.email,
				email: user.email,
				name: user.name,
			});

			await this.userRepository.register(newUser, user.password);

			return ServiceResponse.success<User>("User Registered Successfully", newUser.toObject());
		} catch (error) {
			const errorMessage = `Error registering user: $${(error as Error).message}`;
			logger.error(errorMessage);
			return ServiceResponse.failure((error as Error).message, null, StatusCodes.BAD_REQUEST);
		}
	}

	//Add new User
	public async addTeam(user: User): Promise<ServiceResponse<User | null>> {
		try {
			const newUser = new UserRepository({
				username: user.email,
				email: user.email,
				name: user.name,
				role: user.role,
				location: user.location,
			});

			await this.userRepository.register(newUser, "test1234");

			return ServiceResponse.success<User>("User Registered Successfully", newUser.toObject());
		} catch (error) {
			const errorMessage = `Error registering user: $${(error as Error).message}`;
			logger.error(errorMessage);
			return ServiceResponse.failure((error as Error).message, null, StatusCodes.BAD_REQUEST);
		}
	}

	//login user
	public async login(email: User["email"], password: User["password"]): Promise<ServiceResponse<Token<User> | null>> {
		try {
			const { error, user } = await UserRepository.authenticate()(email, password);

			if (error) {
				logger.error(error);
				return ServiceResponse.failure(error, null, StatusCodes.BAD_REQUEST);
			}

			return ServiceResponse.success("Success", this.generateJWT(user));
		} catch (ex) {
			const errorMessage = `Error finding all users: $${(ex as Error).message}`;
			logger.error(errorMessage);
			return ServiceResponse.failure("An error occurred with login.", null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	//

	private generateJWT(user: User): Token<User> {
		const token = jwt.sign(
			{
				_id: user._id,
				name: user.name,
				email: user.email,
			},
			env.JWT_SECRET,
			{
				expiresIn: env.JWT_EXPIRE as number,
			},
		);

		logger.info(token);

		return {
			_id: user._id,
			name: user.name,
			email: user.email,
			token,
		};
	}
}

export const userService = new UserService();
