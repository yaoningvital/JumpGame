import React from 'react'

class Circle extends React.Component {
  render () {
    let {circleData, handleClickCircle, r, a, selectedRowIndex, selectedColumnIndex} = this.props
    
    let backgroundImage = `radial-gradient(at 80px 80px, rgba(0,0,0,0), ${circleData.color})`
    let buttonWidth = 2 * r
    let buttonMargin = `0 ${a / 2}px`
    
    let boxShadow = circleData.color === '#ddd' ?
      '2px 2px 2px #888888 inset' : '3px 3px 2px rgba(0,0,0,0.2)'
    
    // 给被选中的棋子（被点击的棋子）设置选中样式
    if (selectedRowIndex === circleData.rowIndex && selectedColumnIndex === circleData.columnIndex) {
      buttonWidth += r / 2   // 选中的棋子宽度要增加半径的一半
      buttonMargin = `0 ${a / 2 - r / 4}px`
      boxShadow = '6px 6px 2px rgba(0,0,0,0.4)'
    }
    return (
      <button
        style={{
          backgroundImage: backgroundImage,
          boxShadow: boxShadow,
          width: buttonWidth + 'px',
          height: buttonWidth + 'px',
          borderRadius: buttonWidth / 2 + 'px',
          margin: buttonMargin,
        }}
        onClick={() => handleClickCircle(circleData)}
      />
    )
  }
}

export default Circle