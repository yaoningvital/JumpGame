import React from 'react'

class Circle extends React.Component {
  render () {
    let {circleData, handleClickCircle, r, a, boardRowHeight} = this.props
    
    let backgroundImage = `radial-gradient(at 80px 80px, rgba(0,0,0,0), ${circleData.color})`
    let buttonWidth = 2 * r
    let buttonMargin = `${(boardRowHeight - buttonWidth) / 2}px ${a / 2}px`
    
    let boxShadow = circleData.color === '#ddd' ?
      '2px 2px 2px #888888 inset' : '3px 3px 2px rgba(0,0,0,0.2)'
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
        onClick={handleClickCircle}
      />
    )
  }
}

export default Circle