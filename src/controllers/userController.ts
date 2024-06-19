import prisma from "../utils/db";
import { Request, Response } from "express";

import { User } from "../models/user";
import { mapper } from "../mappers/mapper";
import { UserDto } from "../dtos/userDto";
import { createMap } from "@automapper/core";

// Create a new user
const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;

    // Check if the email already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
      },
    });

    const createdUserDTO = mapper.map(user, User, UserDto);

    res.status(201).json(createdUserDTO);
  } catch (error: any) {
    console.error("Create User Error:", error.message);
    res
      .status(500)
      .json({ error: "Failed to create user", details: error.message });
  }
};

// Get all users
const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    const userDtos = users.map((user) => mapper.map(user, User, UserDto));
    res.status(200).json(userDtos);
  } catch (error: any) {
    console.error("Get Users Error:", error.message);
    res
      .status(500)
      .json({ error: "Failed to get users", details: error.message });
  }
};

// Get a single user by ID
const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user: User | null = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (user) {
      const singleUserDTO = mapper.map(user, User, UserDto);
      res.status(200).json(singleUserDTO);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error: any) {
    console.error("Get User by ID Error:", error.message);
    res
      .status(500)
      .json({ error: "Failed to get user", details: error.message });
  }
};

// Update a user by ID
const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    console.log(name, email);
    const updatedUser: User = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        name,
        email,
      },
    });

    const updatedUserDto = mapper.map(updatedUser, User, UserDto);
    res.status(200).json(updatedUserDto);
  } catch (error: any) {
    console.error("Update User Error:", error.message);
    res
      .status(500)
      .json({ error: "Failed to update user", details: error.message });
  }
};

// Delete a user by ID
const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if the user exists before attempting to delete
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      return res.status(404).json({ message: `User with id: ${id} not found` });
    }

    // Proceed with deletion since the user exists
    await prisma.user.delete({
      where: {
        id: id,
      },
    });

    res.status(200).json({ message: `User with id: ${id} has been deleted` });
  } catch (error: any) {
    console.error("Delete User Error:", error.message);
    res
      .status(500)
      .json({ error: "Failed to delete user", details: error.message });
  }
};

const testMappings = async (req: Request, res: Response) => {
  createMap(mapper, User, UserDto);
  const user = new User();
  user.name = "John Doe";
  user.id = "123";
  user.email = "john@doe.com";
  user.createdAt = new Date();
  user.updatedAt = new Date();

  const dto = mapper.map(user, User, UserDto);

  res.status(200).json(dto);
};

export {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  testMappings,
};
