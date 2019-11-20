import React from 'react'
import clickAudio from "../../assets/audio/click02.wav";


function SetCirclesDistance (props) {
  let {setCirclesDistance} = props
  return (
    <div>
      <h4>设置相邻棋子之间的距离：（默认20px）</h4>
      <input type="text"
             onKeyUp={setCirclesDistance}
      />
      <span> px</span>
  
      {/*audio*/}
      <audio src={clickAudio} id="click-audio">
        您的浏览器不支持 audio 标签。
      </audio>
    </div>
  )
}

export default SetCirclesDistance