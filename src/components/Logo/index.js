import React from 'react';
import "./logo.scss";

export default function Logo(props) {
  return (
    <div className="logo">
      <span role="img" aria-label="logo"><img src="oikos-logo.svg" height="36px"></img></span>
    </div>
  );
}
