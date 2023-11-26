import React, { useState } from "react";
import Search from "../Search";

import { Bounds } from "../../../../../interfaces";
import {
  asianColor,
  blackColor,
  hispanicColor,
  whiteColor,
  otherColor,
} from "../../../../../constants";

interface Props {
  handleVisibility: (s: string) => void;
  handleBounds: (e: Bounds) => void;
}

const race = [
  { race: "Asian", color: asianColor },
  { race: "Black", color: blackColor },
  { race: "Hispanic", color: hispanicColor },
  { race: "White", color: whiteColor },
  { race: "Other Races", color: otherColor },
];

export default function Control({ handleVisibility, handleBounds }: Props) {
  const [level, setLevel] = useState("School");

  const handleChange = (e) => {
    setLevel(e.target.value);
    handleVisibility(e.target.value);
  };

  const legend = () =>
    race.map((el) => (
      <div key={el.race} className="flex items-center">
        <div
          className="w-4 h-4 rounded-sm mr-2 p-1"
          key={el.race}
          style={{ backgroundColor: el.color }}
        />
        <p key={el.race} className="text-md">
          {el.race}
        </p>
      </div>
    ));

  const radio = (l: string, label?: string) => (
    <div className="inline-flex">
      <label className="inline-flex items-center">
        <input
          type="radio"
          name={l}
          value={l}
          checked={level === l}
          onChange={handleChange}
          className="w-4 h-4 mr-2"
        />
        {label || l}
      </label>
    </div>
  );

  const boundaries = () => (
    <>
      <p className="text-lg text-gray-900 mb-1">Boundaries</p>
      <div className="flex flex-col mb-4">
        {radio("School", "No Boundary")}
        {radio("District")}
        {radio("County")}
        {radio("State")}
      </div>
      <div>
        <Search level={level} handleBounds={handleBounds} />
      </div>
    </>
  );

  return (
    <>
      <p className="text-lg text-gray-900 mb-1">Legend</p>
      <div className="flex flex-col w-full mb-4">
        <div className="text-left">{legend()}</div>
      </div>
      {boundaries()}
    </>
  );
}
