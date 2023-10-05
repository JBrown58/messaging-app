import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/user";
import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import dotenv from "dotenv";
dotenv.config();
import Message from "../models/message";
import { Date } from "mongoose";

export const getUserProfile = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findOne({ _id: req.params.userid });
    res.json({ user: user });
  }
);

interface Decoded {
  user?: {
    _id: string;
    username: string;
  };
  iat: number;
  exp: number;
}

interface User {
  messages: [];
  _id: string;
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  about: string;
  phone: string;
  __v: number;
}

interface Message {
  _id: string;
  sender: string;
  recipient: string;
  content: string;
  time: Date;
}

export const getChatMessages = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const clickedUser: User | null = await User.findById({
        _id: req.params.userid,
      }); // this is the person you clicked on
      const usertoken: any = req.headers.authorization;
      const token = usertoken.split(" ");
      const decoded: Decoded | string | JwtPayload = jwt.verify(
        token[1],
        process.env.signature as any
      );
      const userId: any = (<any>decoded).user._id;
      const currentUser: User | null = await User.findById({
        _id: userId,
      } as any);
      if (!clickedUser || !clickedUser.messages) {
        res.status(404).json({ error: "Clicked user or messages not found" });
      }
      console.log("clickedUser " + clickedUser);
      console.log("currentUser " + currentUser);
      const messages = await Message.find({
        $or: [
          { _id: { $in: currentUser!.messages } },
          { _id: { $in: clickedUser!.messages } },
        ],
      }).sort({ time: 1 });

      res.json({
        messages: messages,
      });
    } catch (error) {
      console.error(error);
    }
  }
);

export const postUserChatMessage = [
  body("message", "message must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    } else {
      try {
        const { message, recipient } = req.body;
        const usertoken: any = req.headers.authorization;
        console.log("userId: " + usertoken);

        const token = usertoken.split(" ");
        const decoded: Decoded | string | JwtPayload = jwt.verify(
          token[1],
          process.env.signature as any
        );
        const userId: any = (<any>decoded).user._id;

        const newMessage = new Message({
          sender: userId,
          recipient: recipient,
          content: message,
          time: new Date(),
        });
        await newMessage.save();
        await User.findOneAndUpdate(
          { _id: userId },
          { $push: { messages: newMessage } }
        );
        res.json({ Message: newMessage });
      } catch (error) {
        console.error(error);
      }
    }
  }),
];

export const putUserChatMessage = [
  body("message", "message must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    } else {
      try {
        const { message, messageId } = req.body;
        console.log("here");
        const updatedMessage: Message | null = await Message.findOneAndUpdate(
          { _id: messageId },
          { content: message }
        );
        updatedMessage!.content = message;
        res.json({ Message: updatedMessage });
      } catch (error) {
        console.error(error);
      }
    }
  }),
];

export const deleteUserChatMessage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { messageId } = req.body;
      await Message.findOneAndDelete({ _id: messageId });
      await User.findOneAndUpdate(
        { messages: messageId },
        { $pull: { messages: messageId } }
      );
      res.json({ messageId });
    } catch (error) {
      console.error(error);
    }
  }
);
