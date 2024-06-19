import { createMapper, Mapper, addProfile, createMap } from "@automapper/core";
import { classes } from "@automapper/classes";
import { User } from "../models/user"; // Assuming you have a User class that matches your Prisma model
import { UserDto } from "../dtos/userDto";

const mapper: Mapper = createMapper({
  strategyInitializer: classes(),
});

export const UserMapping = (mapper: Mapper) => {
  createMap(mapper, User, UserDto);
};

addProfile(mapper, UserMapping);

export { mapper };
