import { Button, Dropdown } from "flowbite-react";

export const ToolNavbar = () => {
  return (
    <>
      <div className="flex items-center gap-8 justify-center items-center">
        <div className="flex items-center flex-1 w-full justify-start flex-initial text-sm text-ellipsis">
          Test Prompt Here.
        </div>
        <div className="flex flex-1 items-center gap-2 w-full w-auto ml-auto ">
          <Button size="xs" color="light">
            Save
          </Button>
          <Button size="xs" color="success">
            Share
          </Button>
        </div>
      </div>
    </>
  );
};
