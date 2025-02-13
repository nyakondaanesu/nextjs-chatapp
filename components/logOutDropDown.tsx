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
  userImage: React.ReactNode;
}) {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="bordered">
          <span className="flex items-center space-x-2">
            {userImage}
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
