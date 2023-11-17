import React, { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import Button from "@mui/material/Button";
import clsx from "clsx";

import LevelSelect from "./components/LevelSelect";
import SearchSelect from "./components/SearchSelect";
import YearSelect from "./components/YearSelect";
import GradeSelect from "./components/GradeSelect";

interface Props {
  getData: () => void;
  isLoading: boolean;
}

export default function Selection({ getData, isLoading }: Props) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => setExpanded((e) => !e);

  return (
    <div className="shadow relative">
      <div
        className={clsx({
          "grid grid-cols-1 lg:grid-cols-5 gap-2 container mx-auto p-5 pb-10 lg:pb-5 font-raleway":
            true,
          "hidden lg:grid": !expanded,
        })}
      >
        <LevelSelect />
        <SearchSelect />
        <YearSelect />
        <GradeSelect />
        <div>
          <Button
            onClick={getData}
            disabled={isLoading}
            variant="contained"
            className="h-full"
          >
            <SearchIcon />
          </Button>
        </div>
      </div>
      <Button
        className="!absolute left-1/2 -translate-x-1/2 -translate-y-1/2 !bg-white !rounded-full lg:!hidden"
        variant="outlined"
        onClick={toggleExpanded}
      >
        {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </Button>
    </div>
  );
}
