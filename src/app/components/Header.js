import React from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const Header = () => {
  return (
    <div className="header">
      <div className="container">
        <ArrowLeftIcon className="back-icon" />
        <h1 className="mainHeading">Rule Creation</h1>
        <div className="primary"></div>
      </div>
      <button className="button">Publish Feed</button>
    </div>
  );
};

export default Header;
