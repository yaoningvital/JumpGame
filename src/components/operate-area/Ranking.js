import React from 'react'

function Ranking (props) {
  let {ranking} = props
  
  return (
    <>
      {
        ranking.length > 0 &&
        <div className="ranking">
          {
            ranking.map((color, index) => {
              return (
                <div key={color}>
                  <span>第{index + 1}名：</span>
                  <button style={{
                    background: color,
                  }}/>
                </div>
              )
            })
          }
        </div>
      }
    </>
  )
}

export default Ranking