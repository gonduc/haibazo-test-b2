import React, { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';

function CircleItem(props) {
  let circle = props.circle;
  let onclick = props.onClick;

  const ketquatimeleft = useState(30);
  const timeleft = ketquatimeleft[0];
  const settimeleft = ketquatimeleft[1];

  useEffect(function() {
    let timeid;

    if (circle.isclicked === true) {
      timeid = setInterval(function() {
        settimeleft(function(thoigianhientai) {
          if (thoigianhientai <= 0) {
            clearInterval(timeid);
            return 0;
          } 
          return thoigianhientai - 1;
        });
      }, 100);
    } else {
      settimeleft(30);
    }

    return function() {
      clearInterval(timeid);
    };
  }, [circle.isclicked]);

  let circleclass = 'circle';
  if (circle.isclicked === true) {
    circleclass = 'circle clicked'; 
  }

  let styleobject = {
    left: circle.x,
    top: circle.y,
  };

  function handleclick() {
    if (circle.isclicked === false) {
      onclick(circle.id);
    }
  }

  let timedisplay = null;
  if (circle.isclicked === true) {
    let formattedtime = (timeleft / 10).toFixed(1);
    timedisplay = <div className="click-time">{formattedtime}s</div>;
  }

  return (
    <div 
      className={circleclass}
      style={styleobject}
      onClick={handleclick}
    >
      {circle.id}
      {timedisplay}
    </div>
  );
}

function App() {

  const ketquastatus = useState('IDLE');
  const status = ketquastatus[0];
  const setstatus = ketquastatus[1];

  const ketquapoints = useState(5);
  const points = ketquapoints[0];
  const setpoints = ketquapoints[1];

  const ketquatime = useState(0);
  const time = ketquatime[0];
  const settime = ketquatime[1];

  const ketquacircle = useState([]);
  const circle = ketquacircle[0];
  const setcircle = ketquacircle[1];

  const ketquanexttarget = useState(1);
  const nexttarget = ketquanexttarget[0];
  const setnexttarget = ketquanexttarget[1];

  const ketquaautoplay = useState(false);
  const isautoplay = ketquaautoplay[0];
  const setisautoplay = ketquaautoplay[1];

  const timeRef = useRef(0);

  let titleColotClass = '';
  let titleText = '';

  if (status === 'WON') {
    titleColotClass = 'text-green';
    titleText = 'ALL CLEARED';
  } else if (status === 'LOST') {
    titleColotClass = 'text-red';
    titleText = 'GAME OVER';
  } else {
    titleColotClass = '';
    titleText = "LET'S PLAY";
  }

  let buttonplayorreset = null;
  if (status === 'IDLE') {
    buttonplayorreset = <button onClick={startgame}>PLAY</button>;
  } else {
    buttonplayorreset = <button onClick={startgame}>RESET</button>;
  }

  function handleToggleAutoPlay() {
    setisautoplay(!isautoplay);
  }

  let buttonautoplay = null;
  if (status !== 'IDLE') {
    let autoplaytext = '';
    if (isautoplay === true) {
      autoplaytext = 'OFF';
    } else {
      autoplaytext = 'ON';
    }
    buttonautoplay = <button onClick={handleToggleAutoPlay}>{`AUTO PLAY: ${autoplaytext}`}</button>;
  }

  let isInputDisabled = false;
  if (status === 'PLAYING' || isautoplay === true) {
    isInputDisabled = true;
  }

  function handleinputchange(event) {
    let giatrimoi = Number(event.target.value);
    setpoints(giatrimoi);
  }

  useEffect(function() {
    timeRef.current = time;
  }, [time]);

  function startgame() {
    setstatus('PLAYING');
    setnexttarget(1);
    settime(0);
    setisautoplay(false);

    let newcircle = [];
    let boardwidth = 600;
    let boardheight = 400;

    for (let i = 1; i <= points; i++) {
      let randomx = Math.floor(Math.random() * (boardwidth - 40));
      let randomy = Math.floor(Math.random() * (boardheight - 40));

      newcircle.push({
        id: i,
        x: randomx,
        y: randomy,
        isclicked: false,
        clicktime: null,
      });
    }

    newcircle.sort(function() {
      return Math.random() - 0.5;
    });

    setcircle(newcircle);
  }

  useEffect(function() {
    let timeid;

    if (status === 'PLAYING') {
      timeid = setInterval(function() {
        settime(function(thoigiancu) {
          return thoigiancu + 1;
        });
      }, 100);
    } 
    return function() {
      clearInterval(timeid);
    }
  }, [status]);


  const handlecircleclick = useCallback(function(id) {
    if (status !== 'PLAYING') {
      return;
    }

    if (id === nexttarget) {
      setcircle(function(danhsachcu) {
        let danhsachmoi = [];

        for (let i = 0; i < danhsachcu.length; i++) {
          let vongtronhientai = danhsachcu[i];

          if (vongtronhientai.id === id) {
            danhsachmoi.push({
              id: vongtronhientai.id,
              x: vongtronhientai.x,
              y: vongtronhientai.y,
              isclicked: true,
            });
          } else {
            danhsachmoi.push(vongtronhientai);
          }
        }

        return danhsachmoi;
      });

      if (id === points) {
        setstatus('WON');
        setisautoplay(false);
      } else {
        setnexttarget(id + 1);
      }
    } else {
      setstatus('LOST');
      setisautoplay(false);
    }
  }, [status, nexttarget, points, setisautoplay]);


  let circleelement = [];
  for (let i = 0; i < circle.length; i++) {
    let circledata = circle[i];
    circleelement.push(
      <CircleItem
        key={circledata.id}
        circle={circledata}
        onClick={handlecircleclick}
      />
    );
  }

  useEffect(function() {
    let timeid;

    if (isautoplay === true && status === 'PLAYING') {
      timeid = setTimeout(function() {
        handlecircleclick(nexttarget);
      }, 500);
    }

    return function() {
      clearTimeout(timeid);
    }
  }, [isautoplay, status, nexttarget, handlecircleclick]);


  return (
    <div className="App">
      <div className="header">
        <div className={`title ${titleColotClass}`}>
        {titleText}
        </div>

        <div className='controls'>
          <label> points: </label>
          <input 
            type="number" 
            value={points} 
            onChange={handleinputchange}
            disabled={isInputDisabled} 
          />
        </div>

        <div className="controls">
          <label> time: {(time / 10).toFixed(1)}s </label>
        </div>

        <div className="controls">
          {buttonplayorreset}
          {buttonautoplay}
        </div>
      </div>

     <div className="game-board">
      {circleelement}
      </div>
    
    </div>
  );
}

export default App;