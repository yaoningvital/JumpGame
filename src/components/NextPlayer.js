import React from 'react'
import { getChoosedColorArr } from '../utils'

function NextPlayer (props) {
  let {availableColors, currentStep, r} = props
  let selectedColors = getChoosedColorArr(availableColors)
  let nextStepRadius = r * 0.8
  
  
  return (
    <div className="status">
      {selectedColors.length > 0 && <span>下一步：</span>}
      {
        selectedColors.map((color, index) => {
          let isCurrentBtn = index === currentStep % selectedColors.length
          let nextStepBtnStyle;
          if (isCurrentBtn) {
            nextStepBtnStyle = {
              width: `${nextStepRadius * 2.5}px`,
              height: `${nextStepRadius * 2.5}px`,
              borderRadius: `${nextStepRadius * 1.25}px`,
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