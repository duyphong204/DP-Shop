// components/common/SearchBar.jsx
import React, { useState, useRef } from "react";
import { HiMagnifyingGlass, HiXMark } from "react-icons/hi2";

const SearchBar = ({ placeholder = "Tìm kiếm...", onSearch, className = "", inputClass = "" }) => {
  const [term, setTerm] = useState("");
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = term.trim();
    if (query && onSearch) {
      onSearch(query);
      setTerm("");
    }
  };

  const handleClear = () => {
    setTerm("");
    inputRef.current?.focus();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`
        flex items-center bg-white border border-gray-300 rounded-full shadow-sm 
        overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 
        focus-within:border-blue-500 transition-all
        ${className}
      `}
    >
      <input
        ref={inputRef}
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder={placeholder}
        className={`flex-1 px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none ${inputClass}`}
      />
      {term && (
        <button type="button" onClick={handleClear} className="p-2 text-gray-400 hover:text-gray-600">
          <HiXMark className="w-5 h-5" />
        </button>
      )}
      <button type="submit" className="p-2.5 text-blue-500 hover:text-blue-700">
        <HiMagnifyingGlass className="w-5 h-5" />
      </button>
    </form>
  );
};

export default SearchBar;