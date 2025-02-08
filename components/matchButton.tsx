import React, { MouseEventHandler } from "react";
import styled from "styled-components";

const Button = ({
  onClick,
  isLoading,
  isSearchingDisc,
}: {
  onClick: () => void;
  isLoading: boolean;
  isSearchingDisc: boolean;
}) => {
  return (
    <StyledWrapper>
      <button className="button mt-10" onClick={onClick}>
        <span className={isSearchingDisc ? `hidden` : ""}>
          {" "}
          {isLoading ? "Match making..." : "Match Make"}
        </span>
        <span className={!isSearchingDisc ? `hidden` : ""}>
          {isSearchingDisc ? "Searching for a new match.." : "Match Make"}
        </span>
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .button {
    position: relative;
    text-decoration: none;
    color: #fff;
    background: linear-gradient(45deg, #0ce39a, #69007f, #fc0987);
    padding: 14px 25px;
    border-radius: 10px;
    font-size: 1.25em;
    cursor: pointer;
  }

  .button span {
    position: relative;
    z-index: 1;
  }

  .button::before {
    content: "";
    position: absolute;
    inset: 1px;
    background: #272727;
    border-radius: 9px;
    transition: 0.5s;
  }

  .button:hover::before {
    opacity: 0.7;
  }

  .button::after {
    content: "";
    position: absolute;
    inset: 0px;
    background: linear-gradient(45deg, #0ce39a, #69007f, #fc0987);
    border-radius: 9px;
    transition: 0.5s;
    opacity: 0;
    filter: blur(20px);
  }

  .button:hover:after {
    opacity: 1;
  }
`;

export default Button;
