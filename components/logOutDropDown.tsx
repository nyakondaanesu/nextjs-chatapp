import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import Image from "next/image";
import React from "react";
export default function LogOutDropDown({
  name,
  userImage,
}: {
  name: string;
  userImage: string;
}) {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="bordered">
          <span className="flex items-center space-x-2">
            <img src={userImage} width={16} height={16} alt="user image" />
            <p>{name}</p>
          </span>
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem key="delete" className="text-danger" color="danger">
          <Button variant="bordered">log out</Button>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
