import React from 'react'

function HistorySteps (props) {
  let {history} = props
  return (
    <div>
      <h4>历史步骤：</h4>
      {
        history.map((step, move) => {
          let desc = `回退到第${move}步`
          return move ? <button>{desc}</button> : null
        })
      }
    </div>
  )
}

export default HistorySteps