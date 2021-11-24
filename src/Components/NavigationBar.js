import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import chains from "../utils/chainId";

const NavigationBar = () => {
  const [active, setActive] = useState(0);
  const [account, setAccount] = useState("");
  const [chainId, setChainId] = useState("");

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
  const provider = useSelector((state) => state.provider.blockchain);

  useEffect(async () => {
    if (provider) {
      const accounts = await provider.provider.listAccounts();
      let account = accounts[0];
      setAccount(account);
      const { chainId } = await provider.provider.getNetwork();
      setChainId(chainId);
    }
  }, [provider]);

  const activeStyle = (id) => {
    return active === id
      ? {
          backgroundColor: "rgb(17,24,39)",
          borderRadius: "10px",
          padding: "10px",
          color: "white",
        }
      : {
          backgroundColor: "transparent",
          borderRadius: "10px",
          padding: "10px",
          color: "white",
        };
  };

  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>

              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className="hidden h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex-shrink-0 flex items-center">
              <p className="text-2xl text-white">NFT Marketplace</p>
            </div>
            <div className="hidden sm:block sm:ml-6">
              <div className="flex space-x-4">
                <a
                  href="/"
                  className="text-white px-3 py-2 rounded-md text-sm font-medium"
                  aria-current="page"
                  style={activeStyle(1)}
                >
                  Home
                </a>

                <a
                  href="/assets"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  style={activeStyle(2)}
                >
                  Assets
                </a>

                <a
                  href="/list"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  style={activeStyle(3)}
                >
                  List
                </a>
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex hidden md:block ">
            <div className="text-white flex items-center mt-2">
              {chainId in chains && (
                <div>
                  <div className="flex justify-center">
                    <p className="mt-2 mr-2">
                      <i
                        className="fa fa-wifi"
                        style={{ color: "rgb(11,244,69)" }}
                      ></i>{" "}
                      {"connected to "}
                    </p>
                    <div
                      style={{
                        height: "38px",
                        width: "38px",
                        borderRadius: "50%",
                        padding: "5px",
                      }}
                      className="bg-white flex justify-center"
                    >
                      <img
                        title={chains[chainId].name}
                        style={{ height: "30px" }}
                        src={chains[chainId].logo}
                      />
                    </div>
                  </div>
                </div>
              )}
              <div className="ml-3 relative">
                <div
                  className="text-white bg-gray-700"
                  style={{ padding: "10px", borderRadius: "10px" }}
                >
                  {account === "" && <p>Loading...</p>}
                  {account !== "" && (
                    <p title={account}>
                      {account.substring(0, 5) +
                        "..." +
                        account.substring(account.length - 5, account.length)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="sm:hidden" id="mobile-menu">
        <div class="px-2 pt-2 pb-3 space-y-1">
          <a
            href="#"
            class="bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium"
            aria-current="page"
          >
            Dashboard
          </a>

          <a
            href="#"
            class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            Team
          </a>

          <a
            href="#"
            class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            Projects
          </a>

          <a
            href="#"
            class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            Calendar
          </a>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
