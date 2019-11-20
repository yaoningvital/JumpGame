import React from 'react'

function RotateBoard (props) {
  let {handleRotateDirectionChange, setRotateDegNum, handleRotate} = props
  return (
    <div className="rotate-board">
      <h4>旋转棋盘</h4>
      <div className="btn-wrap">
        <select name="" id="" onChange={handleRotateDirectionChange}>
          <option value="+">顺时针</option>
          <option value="-">逆时针</option>
        </select>
        <input type="number"
               placeholder="请输入旋转角度"
               onKeyUp={setRotateDegNum}
        />
        <span> °</span>
      </div>
      <div className="rotate-preset">
        <div>
          <button onClick={() => handleRotate('+', 60)}>顺时针转60°</button>
          <button onClick={() => handleRotate('+', 120)}>顺时针转120°</button>
          <button onClick={() => handleRotate('+', 180)}>顺时针转180°</button>
        </div>
        <div>
          <button onClick={() => handleRotate('-', 60)}>逆时针转60°</button>
          <button onClick={() => handleRotate('-', 120)}>逆时针转120°</button>
          <button onClick={() => handleRotate('-', 180)}>逆时针转180°</button>
        </div>
      </div>
    </div>
  )
}

export default RotateBoard