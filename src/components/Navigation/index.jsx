import React from "react";
import { Link } from "react-router-dom";
import sketches from "data/sketches";
import "./styles.scss";

const Navigation = () => {
  return (
    <nav className="c-navigation">
      {sketches.map((sketch) => (
        <div className="c-nav-item">
          <Link to={`/${sketch.path}`}>{sketch.label}</Link>
        </div>
      ))}
    </nav>
  );
};

export default Navigation;
