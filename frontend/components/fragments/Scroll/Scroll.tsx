import React from "react";
import Link from "next/link";
import Image from "next/image";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";

import Scroller from "./components/Scroller";

import MarGradyLogo from "../../../public/MarGradyLogo.png";

function EndScreen() {
  return (
    <div className="sticky h-screen flex flex-col py-10 items-center justify-between text-lg lg:text-xl px-5">
      <div className="px-4 text-center">
        <p className="mb-4">
          IntegrateUSA was built to explore segregation in districts, counties
          and states nationwide
        </p>
        <p>
          Use the dashboard to visualize demographics and understand segregation
          levels in different areas over time
        </p>
      </div>
      <Link
        href="/info"
        className="hover:text-gray-500  inline-flex items-center"
      >
        Explore the dashboard
        <KeyboardDoubleArrowRightIcon className="ml-2" fontSize="large" />
      </Link>
      <Link href="http://www.margrady.com/">
        <Image src={MarGradyLogo} alt="MarGrady Logo" width={350} />
      </Link>
    </div>
  );
}

export default function Scroll() {
  return (
    <div className="font-sans">
      <Scroller />
      <EndScreen />
    </div>
  );
}
