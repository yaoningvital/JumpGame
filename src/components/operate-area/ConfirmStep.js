import React from 'react'

function ConfirmStep (props) {
  let {cashCirclesArr, handleStepConfirm} = props
  return (
    <button
      className="confirm-step"
      disabled={cashCirclesArr.length <= 1}
      onClick={handleStepConfirm}
    >确认</button>
  )
}

export default ConfirmStep