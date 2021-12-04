import React, { useEffect } from "react";
import Axios from "axios";

function Search() {
  useEffect(() => {
    let componentMount = true;

    const loadProfile = async () => {
      Axios.get(`profile`);
    };
  });

  return <div></div>;
}

export default Search;
