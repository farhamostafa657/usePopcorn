import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons"; // Empty star

import { useState } from "react";

const containerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
};

const starComponentStyle = {
  display: "flex",
  gap: "3px",
};

const textStyle = {
  lineHieght: "1",
  margin: "0",
};
function StarRating({ maxRating = 5 }) {
  const [rating, setRating] = useState(10);
  function handleRating(i) {
    setRating(i);
  }
  return (
    <div style={containerStyle}>
      <div style={starComponentStyle}>
        {Array.from({ length: maxRating }, (_, i) => (
          <Star onRating={() => handleRating(i + 1)} full={rating >= i + 1} />
        ))}
      </div>
      <p style={textStyle}>{rating || ""}</p>
    </div>
  );
}

const starStyle = {
  cursor: "pointer",
  color: "orange",
};

function Star({ full, onRating }) {
  return (
    <span style={starStyle} role="button" onClick={onRating}>
      {full ? (
        <FontAwesomeIcon icon={solidStar} />
      ) : (
        <FontAwesomeIcon icon={regularStar} />
      )}
    </span>
  );
}

export default StarRating;
