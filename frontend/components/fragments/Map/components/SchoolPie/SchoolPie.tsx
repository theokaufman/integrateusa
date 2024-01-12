import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import clsx from "clsx";

import {
  asianColor,
  blackColor,
  hispanicColor,
  whiteColor,
  otherColor,
} from "constants/";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  hoverInfo: any;
  small?: boolean;
}

const labels = ["Asian", "Black", "Hispanic", "White", "Other Races"];

const getSchoolInfo = (hoverInfo) => {
  const { dist_name, county_name, year, tot_enr, as, bl, hi, wh, or } =
    hoverInfo.feature.properties;

  const districtName = dist_name;
  const countyName = county_name;
  const enrollmentYear = year;

  const studentsTotal = tot_enr;
  const asianTotal = as;
  const blackTotal = bl;
  const hispanicTotal = hi;
  const whiteTotal = wh;
  const otherTotal = or;

  const asianRatio = asianTotal / studentsTotal;
  const blackRatio = blackTotal / studentsTotal;
  const hispanicRatio = hispanicTotal / studentsTotal;
  const whiteRatio = whiteTotal / studentsTotal;
  const otherRatio = otherTotal / studentsTotal;

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
    districtName,
    countyName,
    enrollmentYear,
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
        label: (context) => {
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

export default function SchoolPie({ hoverInfo, small = false }: Props) {
  const {
    districtName,
    countyName,
    enrollmentYear,
    studentsEnrolled,
    asianPercentage,
    blackPercentage,
    hispanicPercentage,
    whitePercentage,
    otherPercentage,
    pieData,
  } = getSchoolInfo(hoverInfo);

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
          "pb-4": !small,
          "pb-2 text-center": small,
        })}
      >
        <p>
          <b>District: </b>
          {districtName}
        </p>
        <p>
          <b>County: </b>
          {countyName}
        </p>
        <p>
          <b>{enrollmentYear} Enrollment: </b> {studentsEnrolled}
        </p>
      </div>
      <div className="pb-4 text-center">
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
