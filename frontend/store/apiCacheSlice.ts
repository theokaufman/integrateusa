import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./store";
import { HYDRATE } from "next-redux-wrapper";

import {
  MapData,
  InfoData,
  TrendData,
  SegData,
  ApiStatus,
} from "../interfaces";

interface SegDataCache {
  [key: string]: {
    status: ApiStatus;
    data: SegData;
  };
}

interface InfoDataCache {
  [key: string]: {
    status: ApiStatus;
    data: InfoData;
  };
}

interface TrendDataCache {
  [key: string]: {
    status: ApiStatus;
    data: TrendData;
  };
}

export interface ApiCacheState {
  mapData: MapData | null;
  infoData: InfoDataCache;
  trendData: TrendDataCache;
  segData: SegDataCache;
}

const initialState: ApiCacheState = {
  mapData: null,
  infoData: {},
  trendData: {},
  segData: {},
};

export const apiCacheSlice = createSlice({
  name: "apiCache",
  initialState,
  reducers: {
    setMapData(state, action) {
      state.mapData = action.payload;
    },
    setInfoDataRequest(state, action) {
      const key = action.payload;

      state.infoData = {
        ...state.infoData,
        [key]: {
          ...state.infoData[key],
          status: ApiStatus.Fetching,
        },
      };
    },
    setInfoDataSuccess(state, action) {
      const { key, data } = action.payload;

      state.infoData = {
        ...state.infoData,
        [key]: {
          status: ApiStatus.Success,
          data,
        },
      };
    },
    setInfoDataFailure(state, action) {
      const key = action.payload;

      state.infoData = {
        ...state.infoData,
        [key]: {
          ...state.infoData[key],
          status: ApiStatus.Failure,
        },
      };
    },
    setTrendDataRequest(state, action) {
      const key = action.payload;

      state.trendData = {
        ...state.trendData,
        [key]: {
          ...state.trendData[key],
          status: ApiStatus.Fetching,
        },
      };
    },
    setTrendDataSuccess(state, action) {
      const { key, data } = action.payload;

      state.trendData = {
        ...state.trendData,
        [key]: {
          status: ApiStatus.Success,
          data,
        },
      };
    },
    setTrendDataFailure(state, action) {
      const key = action.payload;

      state.trendData = {
        ...state.trendData,
        [key]: {
          ...state.trendData[key],
          status: ApiStatus.Failure,
        },
      };
    },
    setSegDataRequest(state, action) {
      const key = action.payload;

      state.segData = {
        ...state.segData,
        [key]: {
          ...state.segData[key],
          status: ApiStatus.Fetching,
        },
      };
    },
    setSegDataSuccess(state, action) {
      const { key, data } = action.payload;

      state.segData = {
        ...state.segData,
        [key]: {
          status: ApiStatus.Success,
          data,
        },
      };
    },
    setSegDataFailure(state, action) {
      const key = action.payload;

      state.segData = {
        ...state.segData,
        [key]: {
          ...state.segData[key],
          status: ApiStatus.Failure,
        },
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action) => {
      return {
        ...state,
        ...(action as any).payload,
      };
    });
  },
});

export const {
  setMapData,
  setInfoDataRequest,
  setInfoDataSuccess,
  setInfoDataFailure,
  setTrendDataRequest,
  setTrendDataSuccess,
  setTrendDataFailure,
  setSegDataRequest,
  setSegDataSuccess,
  setSegDataFailure,
} = apiCacheSlice.actions;

export const selectMapData = (state: AppState) =>
  state.apiCache.mapData as MapData;

export const selectInfoData = (state: AppState) =>
  state.apiCache.infoData as InfoDataCache;

export const selectTrendData = (state: AppState) =>
  state.apiCache.trendData as TrendDataCache;

export const selectSegData = (state: AppState) =>
  state.apiCache.segData as SegDataCache;

export default apiCacheSlice.reducer;
