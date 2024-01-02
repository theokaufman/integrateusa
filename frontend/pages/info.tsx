import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useSearchParams } from "next/navigation";

import Head from "../components/fragments/Head";
import Header from "../components/fragments/Header";
import Selection from "../components/fragments/Selection";
import Info from "../components/fragments/Info";
import Trends from "../components/fragments/Trends";
import Page from "../components/layouts/Page";
import {
  selectYear,
  selectGrade,
  selectLevel,
  selectId,
  selectSelectedName,
  setStateFromParams,
} from "../store/selectSlice";
import {
  selectInfoData,
  setInfoDataRequest,
  setInfoDataSuccess,
  setInfoDataFailure,
  selectTrendData,
  setTrendDataRequest,
  setTrendDataSuccess,
  setTrendDataFailure,
} from "../store/apiCacheSlice";

import { Level, ApiStatus } from "../interfaces";

export default function InfoPage() {
  const dispatch = useDispatch();

  const searchParams = useSearchParams();

  const [infoUsedParams, setInfoUsedParams] = useState(false);
  const [trendUsedParams, setTrendUsedParams] = useState(false);

  const level = useSelector(selectLevel);
  const year = useSelector(selectYear);
  const grade = useSelector(selectGrade);
  const id = useSelector(selectId);
  const title = useSelector(selectSelectedName);
  const infoDataStore = useSelector(selectInfoData);
  const trendDataStore = useSelector(selectTrendData);

  let levelTable = "";
  let levelId = "";

  switch (level) {
    case Level.School:
      levelTable = "schools";
      levelId = "nces_id";
      break;
    case Level.District:
      levelTable = "districttrends";
      levelId = "dist_id";
      break;
    case Level.County:
      levelTable = "countytrends";
      levelId = "county_id";
      break;
    case Level.State:
      levelTable = "statetrends";
      levelId = "state_abb";
      break;
  }

  const infoKey = `${year}-${grade}-${levelId}-${id}`;
  const infoKeyCache = infoDataStore[infoKey];
  const isInfoKeyCached = typeof infoKeyCache !== "undefined";
  const infoDataCache = isInfoKeyCached ? infoKeyCache.data : null;
  const isInfoDataCached = typeof infoDataCache !== "undefined";

  const infoData = isInfoDataCached ? infoDataCache || [] : [];

  const isInfoDataLoading =
    !isInfoKeyCached ||
    (!isInfoDataCached && infoKeyCache.status !== ApiStatus.Failure);

  const trendKey = `${levelTable}-${id}`;
  const trendKeyCache = trendDataStore[trendKey];
  const isTrendKeyCached = typeof trendKeyCache !== "undefined";
  const trendDataCache = isTrendKeyCached ? trendKeyCache.data : null;
  const isTrendDataCached = typeof trendDataCache !== "undefined";

  const trendData = isTrendDataCached ? trendDataCache || [] : [];

  const isTrendDataLoading =
    !isTrendKeyCached ||
    (!isTrendDataCached && trendKeyCache.status !== ApiStatus.Failure);

  useEffect(() => {
    const paramsId = searchParams.get("id");
    const paramsName = searchParams.get("name");
    const paramsLevel = searchParams.get("level");
    const paramsXMin = searchParams.get("xmin");
    const paramsXMax = searchParams.get("xmax");
    const paramsYMin = searchParams.get("ymin");
    const paramsYMax = searchParams.get("ymax");

    const completeParams =
      !!paramsId &&
      !!paramsName &&
      !!paramsLevel &&
      !!paramsXMin &&
      !!paramsXMax &&
      !!paramsYMin &&
      !!paramsYMax;

    if (completeParams && !infoUsedParams) {
      const newState = {
        id: paramsId,
        selectedName: paramsName,
        level: parseInt(paramsLevel),
        bounds: {
          lngmin: parseFloat(paramsXMin),
          lngmax: parseFloat(paramsXMax),
          latmin: parseFloat(paramsYMin),
          latmax: parseFloat(paramsYMax),
        },
      };

      dispatch(setStateFromParams(newState));
      setInfoUsedParams(true);
      return;
    }

    const abortController = new AbortController();

    const infoUrl = `/api/schools/?year=${year}&grade=${grade}&${levelId}=${id}`;

    dispatch(setInfoDataRequest(infoKey));

    axios
      .get(infoUrl, { signal: abortController.signal })
      .then((res) => {
        dispatch(setInfoDataSuccess({ key: infoKey, data: res.data }));
      })
      .catch((error) => {
        if (error.name !== "CanceledError") {
          dispatch(setInfoDataFailure(infoKey));
        }
      });

    return () => {
      abortController.abort();
    };
  }, [id, level, grade, year, searchParams, infoUsedParams]);

  useEffect(() => {
    const paramsId = searchParams.get("id");
    const paramsName = searchParams.get("name");
    const paramsLevel = searchParams.get("level");
    const paramsXMin = searchParams.get("xmin");
    const paramsXMax = searchParams.get("xmax");
    const paramsYMin = searchParams.get("ymin");
    const paramsYMax = searchParams.get("ymax");

    const completeParams =
      !!paramsId &&
      !!paramsName &&
      !!paramsLevel &&
      !!paramsXMin &&
      !!paramsXMax &&
      !!paramsYMin &&
      !!paramsYMax;

    if (completeParams && !trendUsedParams) {
      const newState = {
        id: paramsId,
        selectedName: paramsName,
        level: parseInt(paramsLevel),
        bounds: {
          lngmin: parseFloat(paramsXMin),
          lngmax: parseFloat(paramsXMax),
          latmin: parseFloat(paramsYMin),
          latmax: parseFloat(paramsYMax),
        },
      };

      dispatch(setStateFromParams(newState));
      setTrendUsedParams(true);
      return;
    }

    const abortController = new AbortController();

    const trendUrl = `/api/${levelTable}/?${levelId}=${id}`;

    dispatch(setTrendDataRequest(trendKey));

    axios
      .get(trendUrl, { signal: abortController.signal })
      .then((res) => {
        dispatch(setTrendDataSuccess({ key: trendKey, data: res.data }));
      })
      .catch((error) => {
        if (error.name !== "CanceledError") {
          dispatch(setTrendDataFailure(trendKey));
        }
      });

    return () => {
      abortController.abort();
    };
  }, [id, level, searchParams, trendUsedParams]);

  return (
    <>
      <Head title="Info" desc="Demographic Information">
        <link rel="icon" href="/mg_logo_cropped.png" />
      </Head>
      <Header />
      <Selection />
      <Page>
        <div className="mx-auto mt-5">
          <Info
            infoData={infoData}
            title={title}
            isLoading={isInfoDataLoading}
          />
          <Trends trendData={trendData || []} isLoading={isTrendDataLoading} />
        </div>
      </Page>
    </>
  );
}
