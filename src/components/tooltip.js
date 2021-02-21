import React from 'react'

const Tooltip = ({ msg, children, position = 'top', fullWidth }) => {
  return (
    <div className={`hasTooltip relative ${fullWidth ? 'w-full' : ''}`} aria-label={msg}>
      <span className="tooltip z-50" position={position}>
        {msg}
      </span>
      {children}
    </div>
  )
}

export default Tooltip
