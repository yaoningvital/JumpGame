import React from 'react'
import Circle from "./Circle";

class Board extends React.Component {
  render () {
    let {circles, handleClickCircle, r, a} = this.props
    
    let boardWidth = 29.445 * (r + a / 2)  // 棋盘的宽高
    let boardBorderRadius = boardWidth / 2
    let boardRowHeight = 1.732 * (r + a / 2)  // 棋子所在行的高度
    
    return (
      <div className="board"
           style={{
             width: boardWidth + 'px',
             height: boardWidth + 'px',
             borderRadius: boardBorderRadius + 'px'
           }}>
        {
          circles.map((rowArr, rowIndex) => {
            return (
              <div className="board-row"
                   key={rowIndex}
                   style={{
                     height: boardRowHeight + 'px',
                   }}
              >
                {
                  rowArr.map((circleItem, circleIndex) => {
                    return (
                      <Circle
                        key={circleIndex}
                        circleData={circleItem}
                        handleClickCircle={handleClickCircle}
                        r={r}
                        a={a}
                        boardRowHeight={boardRowHeight}
                      />
                    )
                  })
                }
              </div>
            )
          })
        }
      </div>
    )
  }
}

export default Board