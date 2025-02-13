import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";

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
        <Button variant="bordered" className="rounded-full px-4">
          <span className="flex items-center space-x-2">
            <img
              src={userImage}
              width={16}
              height={16}
              alt="user image"
              className="rounded-full"
            />
            <p>{name}</p>
            <img
              width="50"
              height="50"
              src="https://img.icons8.com/ios-glyphs/50/down-squared.png"
              alt="down-squared"
            />
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
