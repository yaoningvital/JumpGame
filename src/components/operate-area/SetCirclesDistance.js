import React from 'react'

function SetCirclesDistance (props) {
  let {setCirclesDistance} = props
  return (
    <div>
      <h4>设置相邻棋子之间的距离：（默认20px）</h4>
      <input type="text"
             onKeyUp={setCirclesDistance}
      />
      <span> px</span>
    </div>
  )
}

export default SetCirclesDistance