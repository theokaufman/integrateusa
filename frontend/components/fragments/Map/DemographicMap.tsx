import React, { useState, useCallback, useRef } from "react";
import axios from "axios";
import Map, {
  Layer,
  Source,
  NavigationControl,
  GeolocateControl,
  FullscreenControl,
} from "react-map-gl";
import { Visibility } from "mapbox-gl";
import { useSelector } from "react-redux";
import "mapbox-gl/dist/mapbox-gl.css";

import Slideover from "./components/Slideover";
import ViewDialog from "./components/ViewDialog";
import SchoolPie from "./components/SchoolPie";
import AreaPie from "./components/AreaPie";
import InfoDialog from "./components/InfoDialog";
import LoadingDialog from "./components/LoadingDialog";
import Popup from "./components/Popup";

import { selectBounds } from "../../../store/selectSlice";
import { MapData, Level, MapStatus } from "../../../interfaces";
import {
  asianColor,
  blackColor,
  hispanicColor,
  whiteColor,
  otherColor,
  defaultMapSchoolColor,
  selectedAreaColor,
  unselectedAreaColor,
} from "../../../constants";

const prop_array = [
  "max",
  ["get", "as"],
  ["get", "bl"],
  ["get", "hi"],
  ["get", "wh"],
  ["get", "or"],
];

interface Props {
  onSmallerScreen: boolean;
}

const schoolsSourceId = "schools-source";

export default function DemographicMap({ onSmallerScreen }: Props) {
  const [mapStatus, setMapStatus] = useState(MapStatus.Fetching);
  const [mapData, setMapData] = useState([] as MapData);

  const mapRef = useRef();

  const initialBounds = useSelector(selectBounds);

  const [hoverInfo, setHoverInfo] = useState(null);
  const [isHovering, setIsHovering] = useState(false);

  const [hoverSource, setHoverSource] = useState(null);
  const [hoverSourceLayer, setHoverSourceLayer] = useState(null);

  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const toggleInfoDialog = () => {
    setInfoDialogOpen((o) => !o);
    setIsHovering(false);
  };

  const [cursor, setCursor] = useState("auto");

  const [stateVisible, setStateVisible] = useState("none" as Visibility);
  const [countyVisible, setCountyVisible] = useState("none" as Visibility);
  const [districtVisible, setDistrictVisible] = useState("none" as Visibility);

  const [renderedFeatures, setRenderedFeatures] = useState([]);

  const stateLayer = {
    id: "state-boundary",
    type: "fill" as any,
    source: "state-boundary-source",
    "source-layer": "cb_2018_us_state_500k-8q06w5",
    paint: {
      "fill-outline-color": "rgba(0,0,0,0.4)",
      "fill-color": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        selectedAreaColor,
        unselectedAreaColor,
      ],
    } as any,
    layout: {
      visibility: stateVisible,
    },
  };

  const countyLayer = {
    id: "county-boundary",
    type: "fill" as any,
    source: "county-boundary-source",
    "source-layer": "cb_2018_us_county_500k-6dd9y3",
    paint: {
      "fill-outline-color": "rgba(0,0,0,0.4)",
      "fill-color": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        selectedAreaColor,
        unselectedAreaColor,
      ],
    } as any,
    layout: {
      visibility: countyVisible,
    },
  };

  const districtLayer = {
    id: "district-boundary",
    type: "fill" as any,
    "source-layer": "2021_sd_unified-4mqqrn",
    paint: {
      "fill-outline-color": "rgba(0,0,0,0.4)",
      "fill-color": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        selectedAreaColor,
        unselectedAreaColor,
      ],
    } as any,
    layout: {
      visibility: districtVisible,
    },
  };

  const LayerProps = {
    id: "schools",
    type: "circle" as any,
    source: schoolsSourceId,
    paint: {
      "circle-radius": ["interpolate", ["linear"], ["zoom"], 3.5, 1, 14, 9],
      "circle-color": [
        "case",
        ["==", ["get", "as"], prop_array],
        asianColor,
        ["==", ["get", "bl"], prop_array],
        blackColor,
        ["==", ["get", "hi"], prop_array],
        hispanicColor,
        ["==", ["get", "wh"], prop_array],
        whiteColor,
        ["==", ["get", "or"], prop_array],
        otherColor,
        defaultMapSchoolColor,
      ],
      "circle-stroke-width": 2,
      "circle-stroke-color": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        "#000",
        "transparent",
      ],
    } as any,
  };

  const handleVisibility = (level: Level) => {
    if (level === Level.District) {
      setDistrictVisible("visible");
      setCountyVisible("none");
      setStateVisible("none");
    } else if (level === Level.County) {
      setDistrictVisible("none");
      setCountyVisible("visible");
      setStateVisible("none");
    } else if (level === Level.State) {
      setDistrictVisible("none");
      setCountyVisible("none");
      setStateVisible("visible");
    } else {
      setDistrictVisible("none");
      setCountyVisible("none");
      setStateVisible("none");
    }
  };

  const updateBounds = useCallback((e) => {
    if (mapRef.current) {
      (mapRef.current as any).fitBounds(
        [
          [e.lngmin, e.latmin],
          [e.lngmax, e.latmax],
        ],
        { padding: 25, duration: 2000 }
      );
    }
  }, []);

  const handleBounds = (e) => {
    updateBounds(e);
  };

  const handleHover = useCallback((event) => {
    setHoverInfo(null);
    setIsHovering(false);

    const {
      point: { x, y },
      originalEvent: {
        target: { height, width },
      },
    } = event;

    const hoveredFeature = event.features && event.features[0];

    setHoverInfo(
      hoveredFeature && {
        feature: hoveredFeature,
        x,
        y,
        height,
        width,
      }
    );
    setIsHovering(true);

    if (hoveredFeature) {
      setHoverSource(hoveredFeature.source);
      setHoverSourceLayer(hoveredFeature.sourceLayer);

      if (mapRef.current) {
        (mapRef.current as any).removeFeatureState({
          source: hoveredFeature.source,
          sourceLayer: hoveredFeature.sourceLayer,
        });
        (mapRef.current as any).setFeatureState(
          {
            source: hoveredFeature.source,
            sourceLayer: hoveredFeature.sourceLayer,
            id: hoveredFeature.id,
          },
          { hover: true }
        );
      }
    }
  }, []);

  const onMouseEnter = useCallback(() => setCursor("pointer"), []);

  const onMouseLeave = useCallback(() => {
    if (mapRef.current && hoverSource && hoverSourceLayer) {
      (mapRef.current as any).removeFeatureState({
        source: hoverSource,
        sourceLayer: hoverSourceLayer,
      });
    }

    setIsHovering(false);
    setCursor("auto");
  }, []);

  const onMouseOut = useCallback(() => {
    if (mapRef.current && hoverSource && hoverSourceLayer) {
      (mapRef.current as any).removeFeatureState({
        source: hoverSource,
        sourceLayer: hoverSourceLayer,
      });
    }
  }, []);

  const handleDialog = () => {
    if (hoverInfo) {
      toggleInfoDialog();
    }
  };

  const getData = useCallback(() => {
    setMapStatus(MapStatus.Fetching);

    axios
      .get("/api/mapschools/?q=2022")
      .then((res) => {
        setMapData(res.data.map((d) => d.map_data));
        setMapStatus(MapStatus.Rendering);
      })
      .catch(() => {
        setMapStatus(MapStatus.Failed);
      });
  }, []);

  const onLoad = useCallback(() => {
    if (onSmallerScreen) {
      updateBounds(initialBounds);
    }
    getData();
  }, [onSmallerScreen, initialBounds]);

  const querySchools = () => {
    if (mapRef.current) {
      const features = (mapRef.current as any).queryRenderedFeatures({
        layers: ["schools"],
      });

      setRenderedFeatures(features);
    }
  };

  const onInitialRender = (source) => {
    if (renderedFeatures.length > 0) {
      return;
    }

    if (
      source.isSourceLoaded &&
      source.sourceId === schoolsSourceId &&
      source.source.data.features.length > 0
    ) {
      querySchools();
      setMapStatus(MapStatus.Complete);
    }
  };

  const coordinates = {
    x: hoverInfo?.x,
    y: hoverInfo?.y,
    height: hoverInfo?.height,
    width: hoverInfo?.width,
  };

  const schoolName = hoverInfo?.feature.properties?.sch_name;
  const areaName = hoverInfo?.feature.properties?.NAME;

  const entityName = schoolName || areaName;

  const showPopup = entityName && isHovering;

  const mapboxData = {
    type: "FeatureCollection" as "FeatureCollection",
    features: mapData,
  };

  const mapRenderingComplete = mapStatus === MapStatus.Complete;

  let infoUrlParams = "";
  let segUrlParams = "";

  if (areaName) {
    const { GEOID, STUSPS, NAME } = hoverInfo.feature.properties;

    let level = "";
    let id = "";

    if (GEOID.length === 5) {
      id = GEOID;
      level = Level.County.toString();
    } else if (GEOID.length === 7) {
      id = GEOID;
      level = Level.District.toString();
    } else if (STUSPS) {
      id = STUSPS;
      level = Level.State.toString();
    }

    const params = new URLSearchParams({});

    if (id) {
      params.append("id", id);
    }

    if (level) {
      params.append("level", level);
    }

    if (NAME) {
      params.append("name", NAME);
    }

    infoUrlParams = `/?${params.toString()}`;
    segUrlParams = `/?${params.toString()}`;
  } else if (schoolName) {
    const { dist_id, dist_name, state_abb } = hoverInfo.feature.properties;

    const level = Level.District.toString();
    const distId = dist_id;
    const distName = `${dist_name} (${state_abb})`;

    const segParams = new URLSearchParams({});

    if (distId) {
      segParams.append("id", distId);
    }

    if (level) {
      segParams.append("level", level);
    }

    if (distName) {
      segParams.append("name", distName);
    }

    segUrlParams = `/?${segParams.toString()}`;
  }

  const pie = (small?: boolean) =>
    schoolName ? (
      <SchoolPie hoverInfo={hoverInfo} small={small} />
    ) : (
      <AreaPie hoverInfo={hoverInfo} mapData={mapData} small={small} />
    );

  console.log(mapboxData);

  return (
    <>
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: -98.5795,
          latitude: 39.828175,
          zoom: 4,
        }}
        style={{ position: "relative", width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/light-v10"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        attributionControl={true}
        interactiveLayerIds={[
          "schools",
          "district-boundary",
          "county-boundary",
          "state-boundary",
        ]}
        cursor={cursor}
        onDragStart={onMouseOut}
        onDragEnd={querySchools}
        onLoad={onLoad}
        onClick={handleDialog}
        onMouseMove={handleHover}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseOut={onMouseOut}
        onResize={querySchools}
        onZoomStart={onMouseOut}
        onZoomEnd={querySchools}
        onSourceData={onInitialRender}
      >
        <GeolocateControl position="top-left" />
        <FullscreenControl position="top-left" />
        <NavigationControl position="top-left" />
        <Source
          id="district-boundary-source"
          type="vector"
          url="mapbox://theokaufman.45uz283x"
        >
          <Layer {...districtLayer} />
        </Source>
        <Source
          id="county-boundary-source"
          type="vector"
          url="mapbox://theokaufman.6i9q4by5"
        >
          <Layer {...countyLayer} />
        </Source>
        <Source
          id="state-boundary-source"
          type="vector"
          url="mapbox://theokaufman.a7l31auu"
        >
          <Layer {...stateLayer} />
        </Source>
        <Source
          id={schoolsSourceId}
          type="geojson"
          data={mapboxData}
          generateId
        >
          <Layer {...LayerProps} />
        </Source>
        {showPopup && (
          <Popup name={entityName} coordinates={coordinates}>
            {pie(true)}
          </Popup>
        )}
        <InfoDialog
          name={entityName}
          open={infoDialogOpen}
          handleClose={toggleInfoDialog}
          infoUrlParams={infoUrlParams}
          segUrlParams={segUrlParams}
        >
          {pie()}
        </InfoDialog>
        {mapRenderingComplete && (
          <ViewDialog renderedFeatures={renderedFeatures} />
        )}
        <LoadingDialog open={!mapRenderingComplete} mapStatus={mapStatus} />
      </Map>
      <Slideover
        handleVisibility={handleVisibility}
        handleBounds={handleBounds}
      />
    </>
  );
}
