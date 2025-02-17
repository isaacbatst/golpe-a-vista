import React from 'react'

const AlertIndicator = () => {
  return (
    <span className="absolute top-0 right-0 -mt-1 -mr-1">
    <span className="relative flex size-3">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
      <span className="relative inline-flex size-3 rounded-full bg-red-500"></span>
    </span>
  </span>
  )
}

export default AlertIndicator