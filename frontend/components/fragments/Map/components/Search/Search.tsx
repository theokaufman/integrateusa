import React, { useState, useMemo, useEffect, SyntheticEvent } from "react";
import axios from "axios";
import { debounce } from "@mui/material/utils";
import { useSelector, useDispatch } from "react-redux";

import Autocomplete from "components/atoms/Autocomplete";

import {
  ApiStatus,
  MapLevel,
  Bounds,
  LocationSearchResult,
  DistrictType,
  Level,
} from "interfaces";
import {
  setLocationSearchRequest,
  setLocationSearchSuccess,
  setLocationSearchFailure,
  selectLocationSearch,
} from "store/apiCacheSlice";

interface Props {
  mapLevel: MapLevel;
  handleBounds: (e: Bounds) => void;
}

const getURL = (mapLevel: MapLevel) => {
  switch (mapLevel) {
    case MapLevel.UnifiedElementaryDistrict:
    case MapLevel.UnifiedSecondaryDistrict:
      return "/api/districtnames/?q=";
    case MapLevel.County:
      return "/api/countynames/?q=";
    case MapLevel.State:
      return "/api/statenames/?q=";
  }

  return "";
};

const convertMapLevelToLevel = (mapLevel: MapLevel): Level => {
  switch (mapLevel) {
    case MapLevel.School:
      return Level.School;
    case MapLevel.UnifiedElementaryDistrict:
    case MapLevel.UnifiedSecondaryDistrict:
      return Level.District;
    case MapLevel.County:
      return Level.County;
    case MapLevel.State:
      return Level.School;
  }
};

export default function Search({ mapLevel, handleBounds }: Props) {
  const locationSearchStore = useSelector(selectLocationSearch);

  const dispatch = useDispatch();

  const [value, setValue] = useState<LocationSearchResult | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  const fetch = useMemo(
    () =>
      debounce(
        (
          input: string,
          abortController: AbortController,
          callback: (results?: readonly any[]) => void,
          callbackFailure: (error) => void
        ) => {
          const url = `${getURL(mapLevel)}${input}`;

          axios
            .get(url, { signal: abortController.signal })
            .then((res: any) => {
              sessionStorage.setItem(url, JSON.stringify(res.data));
              callback(res.data);
            })
            .catch((error) => callbackFailure(error));
        },
        400
      ),
    [mapLevel]
  );

  useEffect(() => {
    const abortController = new AbortController();

    if (inputValue === "") {
      setLoading(false);
      return;
    }

    if (value && value.label === inputValue) {
      setLoading(false);
      return;
    }

    const level = convertMapLevelToLevel(mapLevel);

    const locationSearchKey = `${level}-${inputValue}`;

    const callback = (results?: readonly any[]) => {
      let newOptions: readonly LocationSearchResult[] = [];

      if (results) {
        let filteredResults = [...results];

        if (mapLevel === MapLevel.UnifiedElementaryDistrict) {
          filteredResults = results.filter(
            (r) => r.dist_type !== DistrictType.Secondary
          );
        } else if (mapLevel === MapLevel.UnifiedSecondaryDistrict) {
          filteredResults = results.filter(
            (r) => r.dist_type !== DistrictType.Elementary
          );
        }

        const resultsOptions = filteredResults.map((ro) => {
          let labelData = {
            value: "",
            label: "",
          };

          switch (mapLevel) {
            case MapLevel.School:
              labelData = {
                value: ro.nces_id,
                label: ro.sch_name,
              };
              break;
            case MapLevel.UnifiedElementaryDistrict:
            case MapLevel.UnifiedSecondaryDistrict:
              labelData = {
                value: ro.dist_id,
                label: ro.dist_name,
              };
              break;
            case MapLevel.County:
              labelData = {
                value: ro.county_id,
                label: ro.county_name,
              };
              break;
            case MapLevel.State:
              labelData = {
                value: ro.state_abb,
                label: ro.state_name,
              };
              break;
          }

          return {
            ...labelData,
            lngmin: ro.lngmin,
            latmin: ro.latmin,
            lngmax: ro.lngmax,
            latmax: ro.latmax,
            lat_new: ro.lat_new || null,
            lon_new: ro.lon_new || null,
          };
        });

        newOptions = [...newOptions, ...resultsOptions];
      }

      dispatch(
        setLocationSearchSuccess({ key: locationSearchKey, data: newOptions })
      );
      setLoading(false);
    };

    const callbackFailure = (error) => {
      if (error.name !== "CanceledError") {
        dispatch(setLocationSearchFailure(locationSearchKey));
        setLoading(false);
      }
    };

    dispatch(setLocationSearchRequest(locationSearchKey));
    setLoading(true);

    fetch(inputValue, abortController, callback, callbackFailure);

    return () => {
      abortController.abort();
    };
  }, [inputValue, value, fetch, mapLevel]);

  useEffect(() => {
    setValue(null);
    setInputValue("");
  }, [mapLevel]);

  const handleChange = (
    event: SyntheticEvent<Element, Event>,
    newValue: LocationSearchResult
  ) => {
    setValue(newValue);

    if (newValue) {
      handleBounds(newValue);
    }
  };

  const handleInputChange = (
    event: SyntheticEvent<Element, Event>,
    newInputValue: string
  ) => {
    setInputValue(newInputValue);
  };

  let placeholder = "";

  switch (mapLevel) {
    case MapLevel.School:
      placeholder = "Select District, County or State";
      break;
    case MapLevel.UnifiedElementaryDistrict:
      placeholder = "Type an elementary district name";
      break;
    case MapLevel.UnifiedSecondaryDistrict:
      placeholder = "Type a secondary district name";
      break;
    default:
      const levelName = MapLevel[mapLevel].toLowerCase();
      placeholder = `Type a ${levelName} name`;
      break;
  }

  const isDisabled = mapLevel === MapLevel.School;

  const level = convertMapLevelToLevel(mapLevel);

  const locationSearchKey = `${level}-${inputValue}`;
  const locationSearchKeyCache = locationSearchStore[locationSearchKey];
  const isLocationSearchKeyCached =
    typeof locationSearchKeyCache !== "undefined";
  const locationSearchDataCache = isLocationSearchKeyCached
    ? locationSearchKeyCache.data
    : null;
  const isLocationSearchDataCached =
    typeof locationSearchDataCache !== "undefined";

  const locationSearchData = isLocationSearchDataCached
    ? locationSearchDataCache || []
    : [];

  const isLocationSearchDataLoading =
    !isLocationSearchKeyCached ||
    (!isLocationSearchDataCached &&
      locationSearchKeyCache.status !== ApiStatus.Failure);

  let isLoading = isLocationSearchDataLoading && loading;
  let options = locationSearchData;

  console.log("xxxxxxxxxxxxxxx");
  if (value != null) {
    const isValueInOptions =
      options.findIndex((o) => o.value === value.value) != -1;

    console.log(isValueInOptions);

    if (!isValueInOptions) {
      options = [value, ...options];
    }
  }

  console.log(value);
  console.log(options);

  return (
    <Autocomplete
      id="map-search-select"
      value={value}
      inputValue={inputValue}
      options={options}
      loading={isLoading}
      handleChange={handleChange}
      handleInputChange={handleInputChange}
      placeholder={placeholder}
      disabled={isDisabled}
      isOptionEqualToValue={(o, v) => o.value == v.value}
    />
  );
}
