import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const NavigationBar = () => {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const path = window.location.pathname;
    console.log(path);
    switch (path) {
      case "/":
        setActive(1);
        break;
      case "/home":
        setActive(1);
        break;
      case "/assets":
        setActive(2);
        break;
      case "/list":
        setActive(3);
        break;
      default:
        setActive(0);
    }
  }, [window.location.href]);

  const activeStyle = (id) => {
    return active === id
      ? {
          backgroundColor: "rgb(218, 138, 47)",
          borderRadius: "15px",
          padding: "10px",
          color: "white",
        }
      : {
          backgroundColor: "transparent",
          borderRadius: "15px",
          padding: "10px",
          color: "black",
        };
  };

  return (
    <nav className="border-b p-6">
      <p className="text-4xl font-bold">Metaverse Marketplace</p>
      <ul class="flex mt-4">
        <li class="mr-6">
          <a
            class="text-pink-500 hover:text-pink-800"
            href="/home"
            style={activeStyle(1)}
          >
            Home
          </a>
        </li>
        <li class="mr-6">
          <a
            class="text-pink-500 hover:text-pink-800"
            href="/assets"
            style={activeStyle(2)}
          >
            Assets
          </a>
        </li>
        <li class="mr-6">
          <a
            class="text-pink-500 hover:text-pink-800"
            href="/list"
            style={activeStyle(3)}
          >
            List
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default NavigationBar;
