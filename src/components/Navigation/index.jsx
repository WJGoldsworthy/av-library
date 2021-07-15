import React, { useState } from "react";
import { Link } from "react-router-dom";
import sketches from "data/sketches";
import { ReactComponent as Menu } from "../../assets/images/menu.svg";
import { ReactComponent as Close } from "../../assets/images/closeMenu.svg";
import "./styles.scss";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="c-navigation">
      <Menu onClick={() => setIsOpen(!isOpen)} />
      {isOpen && (
        <div className="menu-open">
          <Close onClick={() => setIsOpen(!isOpen)} />
          {sketches.map((sketch) => {
            if (sketch.hidden) {
              return;
            }
            return (
              <Link to={`/${sketch.path}`}>
                <div onClick={() => setIsOpen(!isOpen)} className="c-nav-item">
                  {sketch.label}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
};

export default Navigation;
