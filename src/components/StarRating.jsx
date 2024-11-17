import React, { useState, useEffect, useRef } from 'react';
import Rating from '@mui/material/Rating';
import { styled } from '@mui/material/styles';

const StarRating = ({ onChange, value, ...props }) => {
  const [hoverValue, setHoverValue] = useState(value || 0);
  const ratingRef = useRef(null);

  // Sync hoverValue with value prop when value changes
  useEffect(() => {
    setHoverValue(value);
  }, [value]);

  const handleTouchMove = (event) => {
    const touch = event.touches[0];
    if (!ratingRef.current) return;

    // Prevent vertical scroll
    event.preventDefault();

    const rect = ratingRef.current.getBoundingClientRect();
    const touchX = touch.clientX - rect.left; // X position relative to the element
    const totalWidth = rect.width;
    const stars = 5; // Number of stars in the rating component

    // Calculate the fraction of the star hovered over
    const starWidth = totalWidth / stars;
    const starIndex = Math.floor(touchX / starWidth);
    const fraction = (touchX % starWidth) / starWidth;

    // Determine hover value, supporting half-star ratings
    const newHoverValue = Math.min(starIndex + (fraction > 0.5 ? 1 : 0.5), stars);
    setHoverValue(newHoverValue);
  };

  const handleTouchEnd = () => {
    // Commit the current hover value to the rating value
    onChange(hoverValue);
  };

  const handleClick = (event) => {
    if (!ratingRef.current) return;

    const rect = ratingRef.current.getBoundingClientRect();
    const clickX = event.clientX - rect.left; // X position relative to the element
    const totalWidth = rect.width;
    const stars = 5; // Number of stars in the rating component

    // Calculate the fraction of the star clicked
    const starWidth = totalWidth / stars;
    const starIndex = Math.floor(clickX / starWidth);
    const fraction = (clickX % starWidth) / starWidth;

    // Determine the final rating value, supporting half-star ratings
    const newValue = Math.min(starIndex + (fraction > 0.5 ? 1 : 0.5), stars);
    onChange(newValue);
  };

  return (
    <div
      ref={ratingRef}
      onTouchMove={handleTouchMove}
      onTouchStart={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick} // Handle tap to rate
      style={{ touchAction: 'none', display: 'inline-block' }} // Prevent touch gestures from interfering
    >
      <Rating
        value={hoverValue}
        size='large'
        precision={0.5} // Enable half-star ratings
        {...props}
      />
    </div>
  );
};

const CustomStars = styled(StarRating)({
  '.MuiRating-root': {
    color: '#d73f09',
  }
})

export default CustomStars;