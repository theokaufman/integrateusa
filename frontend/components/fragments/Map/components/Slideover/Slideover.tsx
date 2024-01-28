import { useState } from "react";
import dynamic from "next/dynamic";
import clsx from "clsx";
import MenuIcon from "@mui/icons-material/Menu";

const Drawer = dynamic(() => import("@mui/material/Drawer"));
const IconButton = dynamic(() => import("@mui/material/IconButton"));
const ChevronRightIcon = dynamic(
  () => import("@mui/icons-material/ChevronRight")
);
const Divider = dynamic(() => import("@mui/material/Divider"));

const Control = dynamic(() => import("../Control"));

import { button, drawerPaper, drawerRoot } from "./Slideover.module.scss";
import { Bounds, MapLevel } from "interfaces";

interface Props {
  mapLevel: MapLevel;
  handleMapLevel: (l: MapLevel) => void;
  handleBounds: (e: Bounds) => void;
}

export default function Slideover({
  mapLevel,
  handleMapLevel,
  handleBounds,
}: Props) {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen((o) => !o);

  return (
    <>
      <button
        onClick={toggleOpen}
        className={clsx(
          "absolute top-2.5 right-2.5 z-20 flex justify-center items-center",
          button
        )}
      >
        <MenuIcon fontSize="large" />
      </button>
      <Drawer
        anchor="right"
        open={open}
        onClose={toggleOpen}
        sx={{
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
          },
        }}
        classes={{
          root: drawerRoot,
          paper: drawerPaper,
        }}
        variant="persistent"
      >
        <div className="flex flex-start p-2">
          <IconButton onClick={toggleOpen}>
            <ChevronRightIcon />
          </IconButton>
        </div>
        <Divider />
        <div className="p-4">
          <h1 className="text-xl mb-4">Map Options</h1>
          <Control
            mapLevel={mapLevel}
            handleMapLevel={handleMapLevel}
            handleBounds={handleBounds}
          />
        </div>
      </Drawer>
    </>
  );
}
