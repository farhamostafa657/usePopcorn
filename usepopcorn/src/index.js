import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import StarRating from "./StarRating";
// import './index.css';
// import App from './App';
function Test() {
  const [movieRating, setMovieRating] = useState(0);
  return (
    <>
      <StarRating onSetRating={setMovieRating} color="green" />
      <p>movie rating is {movieRating} </p>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <StarRating
      maxRating={3}
      messages={["bad", "good", "very good"]}
      defaultRating={2}
    />
    <Test />
  </React.StrictMode>
);
