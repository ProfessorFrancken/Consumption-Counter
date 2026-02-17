import React, {useState} from "react";
import {useNavigate} from "react-router";
import {createSearchParams, useSearchParams} from "react-router-dom";

const SearchBar = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const name = searchParams.get("name")?.trim().toLowerCase() || "";

  const [value, setValue] = useState(name);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setValue(newValue);
  };

  const handleSearch = () => {
    const trimmedValue = value.trim();
    setValue(trimmedValue);
    if (trimmedValue === "") {
      window.alert("Please enter a name to search for");
    } else {
      navigate({
        pathname: "/search",
        search: `?${createSearchParams({name: trimmedValue})}`,
      });
    }
  };

  return (
    <div className="searchbar">
      <input
        type="text"
        placeholder="Search name"
        value={value}
        onChange={handleChange}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            handleSearch();
          }
        }}
      />
      <button className="searchbar__button button" onClick={handleSearch}>
        Search
      </button>
    </div>
  );
};

export default SearchBar;
