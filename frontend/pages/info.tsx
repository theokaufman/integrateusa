import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios, { AxiosError } from "axios";

import Head from "components/fragments/Head";
import Selection from "components/fragments/Selection";
import Info from "components/fragments/Info";
import Trends from "components/fragments/Trends";
import Page from "components/layouts/Page";
import Footer from "components/fragments/Footer";

import {
  selectYear,
  selectGrade,
  selectLevel,
  selectId,
  selectSelectedName,
  setStateFromParams,
} from "store/selectSlice";
import {
  selectInfoData,
  setInfoDataRequest,
  setInfoDataSuccess,
  setInfoDataFailure,
  selectTrendData,
  setTrendDataRequest,
  setTrendDataSuccess,
  setTrendDataFailure,
  selectSchoolInfo,
  setSchoolInfoRequest,
  setSchoolInfoSuccess,
  setSchoolInfoFailure,
} from "store/apiCacheSlice";
import { activateZoomOnMap, selectZoomOnMap } from "store/mapSlice";
import { AppDispatch } from "store/store";

import { Level, ApiStatus, InfoData, TrendData, SchoolInfo } from "interfaces";

import { getParamsInfo } from "utils";

export default function InfoPage() {
  const dispatch = useDispatch<AppDispatch>();

  const paramsInfo =
    typeof window === undefined ? null : getParamsInfo(window.location.href);

  const [paramsChecked, setParamsChecked] = useState(false);

  const level = useSelector(selectLevel);
  const year = useSelector(selectYear);
  const grade = useSelector(selectGrade);
  const id = useSelector(selectId);
  const title = useSelector(selectSelectedName);
  const infoDataStore = useSelector(selectInfoData);
  const schoolInfoStore = useSelector(selectSchoolInfo);
  const trendDataStore = useSelector(selectTrendData);
  const zoomOnMap = useSelector(selectZoomOnMap);

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
    (!isInfoDataCached && infoKeyCache.status !== ApiStatus.Failure) ||
    (paramsInfo !== null && !paramsChecked);
  const hasInfoDataFailed =
    !isInfoDataCached && infoKeyCache.status === ApiStatus.Failure;

  const schoolInfoKey = id;
  const schoolInfoKeyCache = schoolInfoStore[schoolInfoKey];
  const isSchoolInfoKeyCached = typeof schoolInfoKeyCache !== "undefined";
  const schoolInfoCache = isSchoolInfoKeyCached
    ? schoolInfoKeyCache.data
    : null;
  const isSchoolInfoCached = typeof schoolInfoCache !== "undefined";

  const schoolInfo = isSchoolInfoCached ? schoolInfoCache || [] : [];

  const isSchoolInfoLoading =
    !isSchoolInfoKeyCached ||
    (!isSchoolInfoCached && schoolInfoKeyCache.status !== ApiStatus.Failure) ||
    (paramsInfo !== null && !paramsChecked);
  const hasSchoolInfoFailed =
    !isSchoolInfoCached && schoolInfoKeyCache.status === ApiStatus.Failure;

  const trendKey = `${levelTable}-${id}`;
  const trendKeyCache = trendDataStore[trendKey];
  const isTrendKeyCached = typeof trendKeyCache !== "undefined";
  const trendDataCache = isTrendKeyCached ? trendKeyCache.data : null;
  const isTrendDataCached = typeof trendDataCache !== "undefined";

  const trendData = isTrendDataCached ? trendDataCache || [] : [];

  const isTrendDataLoading =
    !isTrendKeyCached ||
    (!isTrendDataCached && trendKeyCache.status !== ApiStatus.Failure) ||
    (paramsInfo !== null && !paramsChecked);
  const hasTrendDataFailed =
    !isTrendDataCached && trendKeyCache.status === ApiStatus.Failure;

  const isSchool = level == Level.School;

  useEffect(() => {
    if (!zoomOnMap) {
      dispatch(activateZoomOnMap());
    }
  }, [dispatch, zoomOnMap]);

  useEffect(() => {
    if (paramsChecked) {
      return;
    }

    if (paramsInfo) {
      dispatch(setStateFromParams(paramsInfo));
    }

    setParamsChecked(true);
  }, [dispatch, paramsChecked, paramsInfo]);

  useEffect(() => {
    if (level == Level.School) {
      return;
    }

    const abortController = new AbortController();

    const infoUrl = `/api/schooltrends/?year=${year}&grade=${grade}&${levelId}=${id}`;

    dispatch(setInfoDataRequest(infoKey));

    axios
      .get<InfoData>(infoUrl, { signal: abortController.signal })
      .then((res) => {
        dispatch(setInfoDataSuccess({ key: infoKey, data: res.data }));
      })
      .catch((error: AxiosError) => {
        if (error.name !== "CanceledError") {
          dispatch(setInfoDataFailure(infoKey));
        }
      });

    return () => {
      abortController.abort();
    };
  }, [id, level, grade, year, dispatch, infoKey, levelId]);

  useEffect(() => {
    if (level != Level.School) {
      return;
    }

    const abortController = new AbortController();

    const schoolInfoUrl = `/api/schoolinfo/?nces_id=${id}`;

    dispatch(setSchoolInfoRequest(schoolInfoKey));

    axios
      .get<SchoolInfo[]>(schoolInfoUrl, { signal: abortController.signal })
      .then((res) => {
        dispatch(setSchoolInfoSuccess({ key: schoolInfoKey, data: res.data }));
      })
      .catch((error: AxiosError) => {
        if (error.name !== "CanceledError") {
          dispatch(setSchoolInfoFailure(schoolInfoKey));
        }
      });

    return () => {
      abortController.abort();
    };
  }, [dispatch, id, schoolInfoKey, level]);

  useEffect(() => {
    const abortController = new AbortController();

    const trendUrl = isSchool
      ? `/api/schooltrends/?nces_id=${id}`
      : `/api/${levelTable}/${id}`;

    dispatch(setTrendDataRequest(trendKey));

    axios
      .get<TrendData>(trendUrl, { signal: abortController.signal })
      .then((res) => {
        dispatch(setTrendDataSuccess({ key: trendKey, data: res.data }));
      })
      .catch((error: AxiosError) => {
        if (error.name !== "CanceledError") {
          dispatch(setTrendDataFailure(trendKey));
        }
      });

    return () => {
      abortController.abort();
    };
  }, [id, level, dispatch, levelId, levelTable, trendKey, isSchool]);

  const infoDataFinal = isSchool
    ? (trendData.filter(
        (td) => td.grade === grade && td.year === year
      ) as InfoData)
    : infoData;
  const isInfoDataLoadingFinal = isSchool
    ? isTrendDataLoading
    : isInfoDataLoading;
  const hasInfoDataFailedFinal = isSchool
    ? hasTrendDataFailed
    : hasInfoDataFailed;

  return (
    <>
      <Head title="Info" desc="Demographic Information" />
      <Selection />
      <Page className="mt-12 lg:mt-0">
        <Info
          title={title}
          infoData={infoDataFinal}
          isInfoDataLoading={isInfoDataLoadingFinal}
          hasInfoDataFailed={hasInfoDataFailedFinal}
          schoolInfo={schoolInfo}
          isSchoolInfoLoading={isSchoolInfoLoading}
          hasSchoolInfoFailed={hasSchoolInfoFailed}
        />
        <Trends
          trendData={trendData || []}
          isLoading={isTrendDataLoading}
          hasFailed={hasTrendDataFailed}
        />
      </Page>
      <Footer />
    </>
  );
}
