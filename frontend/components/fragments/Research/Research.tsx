import React from "react";
import Image from "next/image";
import Link from "next/link";

import district15Img from "./images/district-15.png";

export default function Research() {
  return (
    <>
      <h1 className="text-2xl text-secondary font-semibold border-b border-primary pb-1 mb-6">
        Research
      </h1>
      <h2 className="text-lg mb-10">
        Publications, projects, and other resources appear below.
      </h2>
      <div className="bg-gray-100 p-5 flex flex-col items-center md:flex-row md:items-start">
        <Image
          src={district15Img}
          objectFit="contain"
          alt=""
          height={220}
          className="border border-black"
        />
        <div className="mt-4 md:mt-0 md:ml-4">
          <h3 className="font-semibold mb-2">
            <Link href="/research/district15" className="hover:text-primary">
              Case Study: Middle School Integration in New York City’s District
              15
            </Link>
          </h3>
          <h4 className="text-secondary mb-2">Jesse Margolis</h4>
          <h4 className="text-secondary mb-2">March 2024</h4>
          <p>
            Using data from IntegrateUSA, this{" "}
            <Link
              href="/research/district15"
              className="text-primary hover:text-secondary"
            >
              case study
            </Link>{" "}
            documents the impact of a middle school integration plan in District
            15 in New York City.
          </p>
        </div>
      </div>
    </>
  );
}
