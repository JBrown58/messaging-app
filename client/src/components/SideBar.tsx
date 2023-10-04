import {
  Box,
  HStack,
  VStack,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useEffect } from "react";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import SideBarItem from "./SideBarItem";
interface User {
  messages: [];
  _id: string;
  username: string;
  password: string;
  __v: number;
}

const SideBar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>();
  // useEffect(() => {
  const getUsers = async () => {
    try {
      const token = localStorage.getItem("jwt");
      const yourConfig = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      const data = await axios.get(
        `${import.meta.env.VITE_ENDPOINT}/home`,
        yourConfig
      );
      if (data.status !== 200) {
        throw new Error("Error getting users");
      } else {
        setUsers(data.data.users);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Box onClick={getUsers}>
        <HamburgerIcon onClick={onOpen} data-testid="hamburger-icon" />
      </Box>

      <Drawer
        placement={"left"}
        onClose={onClose}
        isOpen={isOpen}
        size={{ base: "xs" }}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Users</DrawerHeader>
          <DrawerBody>
            <Box>
              {users &&
                users.map(user => (
                  <SideBarItem key={user._id} url={user._id}>
                    {user.username}
                  </SideBarItem>
                ))}
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideBar;