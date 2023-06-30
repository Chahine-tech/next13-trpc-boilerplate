import Link from "next/link";
import React from "react";
import SigninButton from "./SigninButton";

const AppBar = () => {
  return (
    <header className="flex items-center space-x-8">
      <Link className="transition-colors hover:text-blue-500" href={"/"}>
        Home Page
      </Link>
      <SigninButton />
    </header>
  );
};

export default AppBar;
