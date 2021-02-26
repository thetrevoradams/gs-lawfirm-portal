import React from 'react'

const MustContainItem = ({ label, isMet }) => {
  return <li className={`italic ${isMet ? 'text-green-500 line-through' : 'text-gsGrayText'}`}>{label}</li>
}

export default MustContainItem
