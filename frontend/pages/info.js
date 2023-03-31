import React from "react";
import Head from 'next/head';
import Header from "../components/Header";
import Footer from "../components/Footer";
import Selection from "../components/Select/Selection";

export default function Info(){

    return(
        <>
        <Head>
        <title>Info</title>
        <meta name="description" content="Demographic Information" />
        <link rel="icon" href="/mg_logo_cropped.png" />
        </Head>
        <Header/>
        <div className="relative flex flex-col font-raleway">
        <Selection/>
        </div>
        </>
    )
}