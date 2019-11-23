import React from 'react'
import { getChoosedColorArr } from '../utils'

function NextPlayer (props) {
  let {
    availableColors, r,
    getNotCompleteColors, ranking, currentPlayingColor
  } = props
  let choosedColors = getChoosedColorArr(availableColors)
  let notCompleteColors = getNotCompleteColors(choosedColors, ranking)
  let nextStepRadius = r * 0.8
  
  return (
    <div className="status">
      {notCompleteColors.length > 0 && <span>下一步：</span>}
      {
        notCompleteColors.map((color, index) => {
          let isCurrentBtn = color === currentPlayingColor
          let nextStepBtnStyle;
          if (isCurrentBtn) {
            nextStepBtnStyle = {
              width: `${nextStepRadius * 2.6}px`,
              height: `${nextStepRadius * 2.6}px`,
              borderRadius: `${nextStepRadius * 1.3}px`,
            }
          } else {
            nextStepBtnStyle = {
              width: `${nextStepRadius * 2}px`,
              height: `${nextStepRadius * 2}px`,
              borderRadius: `${nextStepRadius}px`,
            }
          }
          return (
            <button
              key={color}
              style={{
                ...nextStepBtnStyle,
                backgroundColor: color,
              }}
            />
          )
        })
      }
    </div>
  )
}

export default NextPlayer