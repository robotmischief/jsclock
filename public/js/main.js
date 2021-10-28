// DOM elements for analog clock
const analogFaceDOM = document.querySelector('.clock-analog-face');
const hourHandDOM = document.querySelector('.hour-hand');
const minuteHandDOM = document.querySelector('.minute-hand');
const secondHandDOM = document.querySelector('.second-hand');
// DOM elements for digital clock
const digitalFaceDOM = document.querySelector('.clock-digital-face');
const secondUnitStaticDOM = document.querySelector('.seconds .unit .static');
const secondUnitAnimatedDOM = document.querySelector('.seconds .unit .animated');
const secondDozenStaticDOM = document.querySelector('.seconds .dozen .static');
const secondDozenAnimatedDOM = document.querySelector('.seconds .dozen .animated');
const minuteUnitStaticDOM = document.querySelector('.minutes .unit .static');
const minuteUnitAnimatedDOM = document.querySelector('.minutes .unit .animated');
const minuteDozenStaticDOM = document.querySelector('.minutes .dozen .static');
const minuteDozenAnimatedDOM = document.querySelector('.minutes .dozen .animated');
const hourUnitStaticDOM = document.querySelector('.hours .unit .static');
const hourUnitAnimatedDOM = document.querySelector('.hours .unit .animated');
const hourDozenStaticDOM = document.querySelector('.hours .dozen .static');
const hourDozenAnimatedDOM = document.querySelector('.hours .dozen .animated');
// DOM switch (analog <> digital clock)
document.querySelector('.switch').addEventListener('change', handleSwitch);
// vars
const debug = false;
let clockMode = "analog";
let prevHoursDozen, prevHoursUnit,
prevMinutesDozen, prevMinutesUnit,
prevSecondsDozen, prevSecondsUnit;

/**
 * @description switch between analog <> digital face of the clock
 * @param {object} e event 
 */
function handleSwitch(e) {
    if (e.srcElement.checked) {
        if (debug) console.log('digital', e.srcElement.checked);
        clockMode = 'digital';
        digitalFaceDOM.className = 'clock-digital-face'
        analogFaceDOM.className = 'clock-analog-face hide';
    } else {
        if (debug) console.log('analog', e.srcElement.checked);
        clockMode = 'analog';
        digitalFaceDOM.className = 'clock-digital-face hide'
        analogFaceDOM.className = 'clock-analog-face';
    }
}

/**
 * @description gets the actual time separated in hours, minutes and seconds
 * @returns {object} timeOBJ individual elements (digits and reference in degrees for analog)
 */
function getTime() {
    const now = new Date();
    const seconds = now.getSeconds();
    const secondsToDegrees = (((seconds / 60) * 360) + 90).toFixed(0);
    const hours = now.getHours();
    const hoursToDegrees = (((hours / 12) * 360) + 90 ).toFixed(0);
    const minutes = now.getMinutes();
    const minutesToDegrees = (((minutes / 60) * 360) + 90).toFixed(0);

    if (debug) {
        console.log(hours + ' >>> ' + hoursToDegrees);
        console.log(minutes + ' >>> ' + minutesToDegrees);
        console.log(seconds + ' >>> ' + secondsToDegrees);
    }

    const timeOBJ = {
        'hours' : hours,
        'hoursToDegrees' : hoursToDegrees,
        'hoursDozen' : parseInt(hours / 10),
        'hoursUnit' : parseInt(hours % 10),
        'minutes' : minutes,
        'minutesToDegrees' : minutesToDegrees,
        'minutesDozen' : parseInt(minutes / 10),
        'minutesUnit' : parseInt(minutes % 10),
        'seconds' : seconds,
        'secondsToDegrees': secondsToDegrees,
        'secondsDozen' : parseInt(seconds / 10),
        'secondsUnit' : parseInt(seconds % 10)
    }

    return timeOBJ;
}

/**
 * @description controls de clock time and visual changes
 */
function handleClock() {
    const time = getTime();
    if (debug) console.log(time);

    if (clockMode === "analog") {
        secondHandDOM.style.transform = `rotate(${time.secondsToDegrees}deg)`;
        minuteHandDOM.style.transform = `rotate(${time.minutesToDegrees}deg)`;
        hourHandDOM.style.transform = `rotate(${time.hoursToDegrees}deg)`;
    } else {
        const {
            hoursDozen,
            hoursUnit,
            minutesDozen,
            minutesUnit,
            secondsDozen,
            secondsUnit
         } = time;
         //checking seconds changes
         if (prevSecondsUnit !== secondsUnit) {
             prevSecondsUnit = secondsUnit;
             handleDigitAnimation(secondUnitStaticDOM, secondUnitAnimatedDOM, secondsUnit);
         }
         if (prevSecondsDozen !== secondsDozen) {
             prevSecondsDozen = secondsDozen;
             handleDigitAnimation(secondDozenStaticDOM, secondDozenAnimatedDOM, secondsDozen);
         }
         //checking minutes changes
         if (prevMinutesUnit !== minutesUnit) {
            prevMinutesUnit = minutesUnit;
            handleDigitAnimation(minuteUnitStaticDOM, minuteUnitAnimatedDOM, minutesUnit);
        }
        if (prevMinutesDozen !== minutesDozen) {
            prevMinutesDozen = minutesDozen;
            handleDigitAnimation(minuteDozenStaticDOM, minuteDozenAnimatedDOM, minutesDozen);
        }
        //cecking hours changes
        if (prevHoursUnit !== hoursUnit) {
            prevHoursUnit = hoursUnit;
            handleDigitAnimation(hourUnitStaticDOM, hourUnitAnimatedDOM, hoursUnit);
        }
        if (prevHoursDozen !== hoursDozen) {
            prevHoursDozen = hoursDozen;
            handleDigitAnimation(hourDozenStaticDOM, hourDozenAnimatedDOM, hoursDozen);
        }
    }
}

/**
 * 
 * @param {object dom element} staticDOM half fixed part of digit
 * @param {object dom element} animatedDOM half animated part digit
 * @param {number} digit time to display
 */
function handleDigitAnimation(staticDOM, animatedDOM, digit){
    staticDOM.querySelector('.top').textContent = digit;
    animatedDOM.querySelector('.bottom').textContent = digit;
    animatedDOM.classList.add('playing');
    animatedDOM.addEventListener('animationend', () => {
        animatedDOM.querySelector('.top').textContent = digit;
        staticDOM.querySelector('.bottom').textContent = digit;
        animatedDOM.classList.remove('playing');
    });
}

/**
 * @description initiaize app on load
 */
window.addEventListener('load', function(){
    setInterval(handleClock, 1000);
    setUpOrientationEvent();
})

/**
* @description set events listeners for mobile phone movement 
*/
function setUpOrientationEvent() {
    if (window.DeviceOrientationEvent) {
      // there is support for orientation
      // handling Apple and absolute orientation
      if ("ondeviceorientationabsolute" in window) {
        window.addEventListener(
          "deviceorientationabsolute",
          function (event) {
            getCompassData(event);
        },
        true
        );
      } else if ("ondeviceorientation" in window) {
          window.addEventListener(
              "deviceorientation",
              function (event) {
                  getCompassData(event);
            },
            true
          );
      }
    }
}

/**
* @description gets device compass data
* @param {object} event
*/
function getCompassData(e) {
    handleTilt(e.beta, e.gamma);
}

/**
 * @description handles mobile phone tilt
 * @param {number} beta front <> back tilt
 * @param {number} gamma left <> right tilt
 */
function handleTilt(beta, gamma) {
    if (gamma === null) return;

    if(gamma >= 0) {
        if(gamma > 20) gamma = 20;
    } else {
        if(gamma < -20) gamma = -20;
    }

    if (debug) console.log(`tilt: beta ${beta} gamma ${gamma}`);

    document.body.style.transform = `rotate(${gamma}deg)`;
}