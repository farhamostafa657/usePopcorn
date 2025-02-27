import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons"; // Empty star
import PropTypes from "prop-types";
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
StarRating.propTypes = {
  maxRating: PropTypes.number,
};

function StarRating({
  maxRating = 5,
  size = 24,
  color = "red",
  className = "",
  messages = [],
  defaultRating = 0,
  onSetRating,
}) {
  const [rating, setRating] = useState(defaultRating);
  const [tempRating, setTempRating] = useState(0);
  const textStyle = {
    lineHieght: "1",
    margin: "0",
    fontSize: `${size}px`,
    color,
  };
  function handleRating(i) {
    setRating(i);
    onSetRating(i);
  }
  return (
    <div style={containerStyle} className={className}>
      <div style={starComponentStyle}>
        {Array.from({ length: maxRating }, (_, i) => (
          <Star
            onRating={() => handleRating(i + 1)}
            full={tempRating ? tempRating >= i + 1 : rating >= i + 1}
            onHoverIn={() => setTempRating(i + 1)}
            onHoverOut={() => setTempRating(0)}
            size={size}
            color={color}
          />
        ))}
      </div>
      <p style={textStyle}>
        {messages.length === maxRating
          ? messages[tempRating ? tempRating - 1 : rating - 1]
          : tempRating || rating || ""}
      </p>
    </div>
  );
}

function Star({ full, onRating, onHoverIn, onHoverOut, size, color }) {
  const starStyle = {
    cursor: "pointer",
    color,
    fontSize: `${size}px`,
  };
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
