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
  const [rating, setRating] = useState(0);
  const [tempRating, setTempRating] = useState(0);
  function handleRating(i) {
    setRating(i);
  }
  return (
    <div style={containerStyle}>
      <div style={starComponentStyle}>
        {Array.from({ length: maxRating }, (_, i) => (
          <Star
            onRating={() => handleRating(i + 1)}
            full={tempRating ? tempRating >= i + 1 : rating >= i + 1}
            onHoverIn={() => setTempRating(i + 1)}
            onHoverOut={() => setTempRating(0)}
          />
        ))}
      </div>
      <p style={textStyle}>{tempRating || rating || ""}</p>
    </div>
  );
}

const starStyle = {
  cursor: "pointer",
  color: "orange",
};

function Star({ full, onRating, onHoverIn, onHoverOut }) {
  return (
    <span
      style={starStyle}
      role="button"
      onClick={onRating}
      onMouseEnter={onHoverIn}
      onMouseLeave={onHoverOut}
    >
      {full ? (
        <FontAwesomeIcon icon={solidStar} />
      ) : (
        <FontAwesomeIcon icon={regularStar} />
      )}
    </span>
  );
}

export default StarRating;
