import React from 'react';
import PropTypes from 'prop-types';

/**
 * A component to display of the current instance of a running timer, or a static time.
 * It displays in the form { 00:00:00 } (hours, minutes, seconds).
 * @param {number} timeElapsed : number of secods passed since timer was activated 
 * @param {string} dateStamp : date when timer activated; acts as a key
 * @returns : a timer string or template literal 
 */

const Timer = function ({ timeElapsed, dateStamp }) {

  // The following subroutine parses <timeElapsed> into a digital clock display format:
  // Only parse the timer if one second or more has elapsed; 
  // otherwise display all zeroes.

  if (timeElapsed > 0) {
    // if there is a totalElapsed time, render it dynamically
    let totSec = timeElapsed; // avoid mutation of parent component's state
    let sec = totSec % 60; // total seconds with remainder (less than 60 sec) cut off
    let minsHrs = totSec - sec; // total number of seconds that add up to complete minutes
    let mins = (minsHrs / 60) % 60; // total minutes less than an hour
    let hrs = (totSec - (totSec % 3600)) / 3600; // hours

    console.log(`totSec=${totSec}:_ hrs=${hrs}, min=${mins}, sec=${sec}`);
    // ^ template literal to display in console: 
    // displays the same output as the JSX in the first subroutine below

    return (
      <div id="timeAndStamp">
        <span id="timerString">
          {hrs.toString().padStart(2, '0')}:{mins.toString().padStart(2, '0')}:
          {sec.toString().padStart(2, '0')}
        </span>
        <br />
        <span>Date started: {dateStamp}</span>
      </div>
    );
  } else {
    // if no time has elapsed or timer is not currently active;
    // show all zeroes w/o parsing the <timeElapsed> parameter
    return (
      <div id="timer">
        <span className="timer">00:00:00</span>
      </div>
    );
  }
};

Timer.defaultProps = {
  timeElapsed: 0,
  dateStamp: '',
}; // display all zeros by default if parameters not specified

Timer.propTypes = {
  timeElapsed: PropTypes.number.isRequired,
  dateStamp: PropTypes.string.isRequired,
};

export default Timer;
