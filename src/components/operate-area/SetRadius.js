import React from 'react'

function SetRadius (props) {
  let {setCircleRadius} = props
  return (
    <div className="set-radius">
      <h4>设置棋子半径大小：（默认20px）</h4>
      <input type="text"
             onKeyUp={setCircleRadius}/><span> px</span>
    </div>
  )
}

export default SetRadius