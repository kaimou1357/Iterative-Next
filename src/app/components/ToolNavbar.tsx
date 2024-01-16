import { Button, Paper } from "@mantine/core";

interface ToolbarNavbarProps {
  prompt: string;
  handleProjectClear: () => void;
  onSaveClick: () => void;
  onShareClick: () => void;
}
export const ToolNavbar = ({
  handleProjectClear,
  onSaveClick,
  onShareClick,
  prompt,
}: ToolbarNavbarProps) => {
  return (
    <>
      <div className="flex items-center gap-8 justify-center items-center">
        <div className="flex items-center flex-1 w-full justify-start flex-initial text-sm text-ellipsis">
          <Paper p="sm" shadow="xs" radius="xl" withBorder>
            {prompt}
          </Paper>
        </div>
        <div className="flex flex-1 items-center gap-2 w-full w-auto ml-auto ">
          <Button variant="outline" onClick={handleProjectClear}>
            Clear Project
          </Button>
          <Button variant="outline" onClick={onSaveClick}>
            Save
          </Button>
          <Button variant="filled" onClick={onShareClick}>
            Share
          </Button>
        </div>
      </div>
    </>
  );
};
