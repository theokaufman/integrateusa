import React, { useState } from "react";
import AsyncSelect from "react-select/async";
import axios from "axios";

export default function Search({ level, handleBounds }) {
  // Input state and function to handle inputs into state/county/district select
  const [input, setInput] = useState("");
  const handleInputChange = (inputValue) => setInput(inputValue);

  // Set URL to search for Counties/Districts/States
  const url = () => {
    if (level === "District") {
      return "/api/districtnames/?q=";
    } else if (level === "County") {
      return "/api/countynames/?q=";
    } else if (level === "State") {
      return "/api/statenames/?q=";
    }
  };

  const loadOptions = async (input) => {
    if (input.length === 0) {
      return null;
    }

    const response = await axios.get(url() + input);

    const Options = await response.data.map((d) => {
      if (level === "District") {
        return {
          value: d.dist_id,
          label: d.dist_name,
          lngmin: d.lngmin,
          latmin: d.latmin,
          lngmax: d.lngmax,
          latmax: d.latmax,
        };
      }
      if (level === "County") {
        return {
          value: d.county_id,
          label: d.county_name,
          lngmin: d.lngmin,
          latmin: d.latmin,
          lngmax: d.lngmax,
          latmax: d.latmax,
        };
      }
      if (level === "State") {
        return {
          value: d.state_abb,
          label: d.state_name,
          lngmin: d.lngmin,
          latmin: d.latmin,
          lngmax: d.lngmax,
          latmax: d.latmax,
        };
      }
    });

    return Options;
  };

  return (
    <AsyncSelect
      name="idselect"
      cacheOptions
      defaultOptions
      onChange={(e) => handleBounds(e)}
      loadOptions={loadOptions}
      isDisabled={level === "School"}
      onInputChange={handleInputChange}
      components={{
        DropdownIndicator: () => null,
        IndicatorSeparator: () => null,
      }}
      placeholder={
        level === "School"
          ? "Select District, County or State to search"
          : "Type a " + level + " name"
      }
      className="pt-2"
    />
  );
}
