import React from 'react'

function ChooseColorsArea (props) {
  let {availableColors, chooseCircleColor, history, playerNum,} = props
  return (
    <div>
      <h4>请选择棋子颜色</h4>
      <div className="circles-color-wrap">
        {
          availableColors.map((colorItem, index) => {
            return (
              <div key={index}
                   className="color-item">
                <input
                  type="checkbox"
                  onChange={() => chooseCircleColor(colorItem.colorValue)}
                  checked={colorItem.checked}
                  disabled={history.length > 1 || !playerNum || colorItem.disabled}
                />
                <button
                  style={{
                    opacity: (history.length > 1 || !playerNum || colorItem.disabled) ? 0.4 : 1,
                    backgroundImage: `radial-gradient(at 80px 80px, rgba(0,0,0,0), ${colorItem.colorValue})`
                  }}
                  onClick={() => chooseCircleColor(colorItem.colorValue)}
                  disabled={history.length > 1 || !playerNum || colorItem.disabled}
                />
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default ChooseColorsArea