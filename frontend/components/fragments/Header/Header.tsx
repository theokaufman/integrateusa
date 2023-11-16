import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

interface NavLinkProps {
  url: string;
  title: string;
}

function NavLink({ url, title }: NavLinkProps) {
  const router = useRouter();

  const isActiveURL = router.pathname === url;

  return (
    <Link href={url}>
      <a
        className={`mr-5 hover:text-secondary ${
          isActiveURL ? "text-primary hover:text-primary" : ""
        }`}
      >
        {title}
      </a>
    </Link>
  );
}

export default function Header() {
  return (
    <header className="text-black bg-white body-font font-raleway shadow">
      <div className="container p-3 mx-auto flex flex-wrap flex-col md:flex-row items-center">
        <Link href="/">
          <a className="flex title-font font-medium items-center text-black mb-4 md:mb-0">
            <Image
              src="/IntegrateUSALogo.png"
              alt="IntegrateUSA logo"
              width={200}
              height={60}
            />
          </a>
        </Link>
        <nav className="md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-gray-400	flex flex-wrap items-center text-base justify-center">
          <NavLink url="/info" title="Demographic Info" />
          <NavLink url="/segregation" title="Segregation" />
          <NavLink url="/map" title="Map" />
          <NavLink url="/about" title="About" />
        </nav>
        <Link href="http://www.margrady.com/">
          <span className="inline-flex items-center hover:cursor-pointer sm:ml-auto sm:mt-0 mt-4 md:justify-center">
            <Image
              src="/mg-logo-text.png"
              alt="MarGrady Logo"
              width={250}
              height={60}
            />
          </span>
        </Link>
      </div>
    </header>
  );
}
