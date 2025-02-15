import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import { signOut } from "@/auth";
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
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button type="submit" className="bg-red-600">
              Log Out
            </button>
          </form>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
