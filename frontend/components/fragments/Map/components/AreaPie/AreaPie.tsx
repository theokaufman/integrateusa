import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  TooltipItem,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import clsx from "clsx";

import {
  asianColor,
  blackColor,
  hispanicColor,
  whiteColor,
  otherColor,
} from "@/colors";

import { HoverInfoInterface, Feature } from "interfaces";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  hoverInfo: HoverInfoInterface | null;
  mapData: Feature[];
  small?: boolean;
}

const labels = ["Asian", "Black", "Hispanic", "White", "Other Races"];

const getAreaInfo = (hoverInfo: HoverInfoInterface, mapData: Feature[]) => {
  const { GEOID, STUSPS } = hoverInfo.feature.properties;

  let layerProp = "";

  let areaId = "";

  if (GEOID.length === 5) {
    areaId = "county_id";
    layerProp = GEOID;
  } else if (GEOID.length === 7) {
    areaId = "dist_id";
    layerProp = GEOID;
  } else if (STUSPS) {
    areaId = "state_abb";
    layerProp = STUSPS;
  }

  let schoolsTotal = 0;
  let studentsTotal = 0;
  let asianTotal = 0;
  let blackTotal = 0;
  let hispanicTotal = 0;
  let whiteTotal = 0;
  let otherTotal = 0;

  for (const feature of mapData) {
    const { asian, black, hispanic, white, other } = feature.properties;

    const tot_enr = asian + black + hispanic + white + other;

    if (feature.properties[areaId] === layerProp) {
      schoolsTotal += 1;
      studentsTotal += tot_enr;
      asianTotal += asian;
      blackTotal += black;
      hispanicTotal += hispanic;
      whiteTotal += white;
      otherTotal += other;
    }
  }

  const asianRatio = asianTotal / studentsTotal;
  const blackRatio = blackTotal / studentsTotal;
  const hispanicRatio = hispanicTotal / studentsTotal;
  const whiteRatio = whiteTotal / studentsTotal;
  const otherRatio = otherTotal / studentsTotal;

  const schoolsInArea = schoolsTotal.toLocaleString();
  const studentsEnrolled = studentsTotal.toLocaleString();
  const asianPercentage = (asianRatio * 100).toFixed(1);
  const blackPercentage = (blackRatio * 100).toFixed(1);
  const hispanicPercentage = (hispanicRatio * 100).toFixed(1);
  const whitePercentage = (whiteRatio * 100).toFixed(1);
  const otherPercentage = (otherRatio * 100).toFixed(1);

  const pieData = [
    asianRatio,
    blackRatio,
    hispanicRatio,
    whiteRatio,
    otherRatio,
  ];

  return {
    schoolsInArea,
    studentsEnrolled,
    asianPercentage,
    blackPercentage,
    hispanicPercentage,
    whitePercentage,
    otherPercentage,
    pieData,
  };
};

const options = {
  reponsive: true,
  plugins: {
    tooltip: {
      enabled: true,
      display: true,
      callbacks: {
        label: (context: TooltipItem<any>) => {
          const label = context.dataset.data[context.dataIndex];
          return (
            labels[context.dataIndex] + " " + Math.round(label * 100) + "%"
          );
        },
      },
    },
    legend: {
      display: false,
    },
  },
};

export default function AreaPie({ hoverInfo, mapData, small = false }: Props) {
  if (!hoverInfo) {
    return null;
  }

  const {
    schoolsInArea,
    studentsEnrolled,
    asianPercentage,
    blackPercentage,
    hispanicPercentage,
    whitePercentage,
    otherPercentage,
    pieData,
  } = getAreaInfo(hoverInfo, mapData);

  const data = {
    labels,
    datasets: [
      {
        label: "Enrollment Share by Race",
        data: pieData,
        borderColor: [
          asianColor,
          blackColor,
          hispanicColor,
          whiteColor,
          otherColor,
        ],
        borderWidth: 1,
        backgroundColor: [
          asianColor,
          blackColor,
          hispanicColor,
          whiteColor,
          otherColor,
        ],
      },
    ],
  };

  return (
    <>
      <div
        className={clsx({
          "pb-10": !small,
          "pb-2": small,
        })}
      >
        <p>
          <b>Total Schools:</b> {schoolsInArea}
        </p>
        <p>
          <b>Students Enrolled:</b> {studentsEnrolled}
        </p>
      </div>
      <div
        className={clsx({
          "pb-4": !small,
          "pb-2 text-center": small,
        })}
      >
        <p>
          <b className="text-asian">Asian: </b> {asianPercentage}%
        </p>
        <p>
          <b className="text-blackstudents">Black: </b> {blackPercentage}%
        </p>
        <p>
          <b className="text-hispanic">Hispanic: </b> {hispanicPercentage}%
        </p>
        <p>
          <b className="text-whitestudents">White: </b> {whitePercentage}%
        </p>
        <p>
          <b className="text-other">Other: </b> {otherPercentage}%
        </p>
      </div>
      <div className="w-1/2 justify-center mx-auto">
        <Pie data={data} options={options} />
      </div>
    </>
  );
}
