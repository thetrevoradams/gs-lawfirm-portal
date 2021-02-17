import React from 'react'

const Briefcase = () => (
  <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"
      stroke="#7C7F93"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"
      stroke="#7C7F93"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
const Message = () => (
  <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M19 13a2 2 0 01-2 2H5l-4 4V3a2 2 0 012-2h14a2 2 0 012 2v10z"
      stroke="#7C7F93"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
const File = () => (
  <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
      stroke="#7C7F93"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 2v6h6M16 13H8M16 17H8M10 9H8"
      stroke="#7C7F93"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const IconButton = ({ icon = 'message', onClick, selected, urgent, title }) => {
  const handleClick = (e) => {
    e.target.blur()
    onClick(icon)
  }
  // const handleKeyPress = (e) => {
  //   if (e.key === 'Enter') {
  //     handleClick(e)
  //   }
  // }
  return (
    <button
      onClick={handleClick}
      // onKeyPress={handleKeyPress}
      type="button"
      title={title}
      aria-pressed={selected}
      className={`iconButton p-2 rounded-full
      shadow hover:shadow-md focus:shadow-md transition-colors focus:outline-none hover:bg-gsBlue focus:bg-gsBlue ${
        // eslint-disable-next-line no-nested-ternary
        selected
          ? 'bg-gsBlue opacity-100 ring-2 ring-gsBlue ring-opacity-30'
          : urgent
          ? 'ring-2 bg-red-400 ring-red-500 ring-opacity-30'
          : 'bg-gsLightBg'
      }`}
    >
      {icon === 'briefcase' && <Briefcase />}
      {icon === 'message' && <Message />}
      {icon === 'file' && <File />}
    </button>
  )
}

export default IconButton
