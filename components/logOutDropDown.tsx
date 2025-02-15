import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";

import React from "react";
import { LogOut } from "@/lib/logging";

export default function LogOutDropDown({
  name,
  userImage,
}: {
  name: string;
  userImage: string;
}) {
  const handleLogout = async () => {
    await LogOut();
  };
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
              width="16"
              height="16"
              src="/dropDown.png"
              alt="down-squared"
            />
          </span>
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem key="delete" className="text-danger" color="danger">
          <button onClick={handleLogout}>log out</button>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
