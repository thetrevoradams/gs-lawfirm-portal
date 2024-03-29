import React, { useRef, useReducer } from 'react'
import IconButton from './iconButton'
import SectionLegal from './sectionLegal'
import SectionRequests from './sectionRequests'
// import SectionAttachment from './sectionAttachment'

const reducer = (state, action) => {
  switch (action.type) {
    case 'changeView':
      return {
        ...state,
        expandedSection: action.icon,
      }
    case 'toggle':
      return {
        expandedSection: action.icon,
        expanded: !state.expanded,
      }
    default:
      return state
  }
}

const RecordItem = ({ record, setSuccessMsg, setErrorMsg, uid }) => {
  const [state, dispatch] = useReducer(reducer, { expanded: false, expandedSection: '' })
  const expanderRef = useRef()
  const containerRef = useRef()
  const { expanded, expandedSection } = state

  const onClick = (icon, href) => {
    if (icon === 'file' && href) {
      window.open(href, '_blank')
      return
    }

    const expander = expanderRef?.current
    const container = containerRef?.current
    const section = expanded ? '' : icon

    if (expanded && icon !== expandedSection) {
      dispatch({ type: 'changeView', icon })
    } else if (expander && container) {
      if (expanded) {
        expander.classList.add('recordCollapsed')
        expander.classList.remove('recordExpanded', 'shadow-md')
        container.classList.add('collapsed')
        container.classList.remove('expanded', 'shadow-md', 'rounded-t')
      } else {
        expander.classList.add('recordExpanded', 'shadow-md')
        expander.classList.remove('recordCollapsed')
        container.classList.add('expanded', 'shadow-md', 'rounded-t')
        container.classList.remove('collapsed')
        setTimeout(() => {
          expander.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          })
        }, 280)
      }
      dispatch({ type: 'toggle', icon: section })
    }
  }

  return (
    <>
      <div
        ref={containerRef}
        className={`flex flex-row justify-between bg-white mx-8 recordItem max-w-screen-lg lg:w-full p-5 z-10 ${
          record.UrgentRequest ? 'border-l-4 border-red-400' : 'border-b border-gsLightGray border-opacity-20'
        }`}
      >
        <div
          className="font-semibold text-gsGrayText grid items-center"
          style={{ gridTemplateColumns: '280px 185px 50px' }}
        >
          <div className="w-60">
            {record.CaseName.split('\r').map((name, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <p key={`r${record.recordId}_${index}`}>{name}</p>
            ))}
          </div>
          <div className={record.CounselFileNumber ? '' : 'opacity-50'}>{record.CounselFileNumber}</div>
          <div>{record['GS JudgmentMaster::JudgmentRecordingState']}</div>
        </div>
        <div className="space-x-5 flex items-center">
          {record['Attachments::AttorneyFolderURL'] && (
            <IconButton
              icon="file"
              onClick={onClick}
              href={record['Attachments::AttorneyFolderURL']}
              title="Attached Documents"
              selected={expandedSection === 'file'}
            />
          )}
          <IconButton
            icon="briefcase"
            onClick={onClick}
            title="Legal Action History"
            selected={expandedSection === 'briefcase'}
          />
          <IconButton
            icon="message"
            title="Request History"
            onClick={onClick}
            selected={expandedSection === 'message'}
            urgent={Boolean(record.UrgentRequest)}
          />
          {/* <IconButton icon="file" title="Attached Documents" onClick={onClick} selected={expandedSection === 'file'} /> */}
        </div>
      </div>
      <div ref={expanderRef} className="opacity-0 bg-white max-w-screen-lg lg:w-full mx-8 rounded-b recordExpander">
        {expandedSection === 'briefcase' && (
          <SectionLegal record={record} setSuccessMsg={setSuccessMsg} setErrorMsg={setErrorMsg} uid={uid} />
        )}
        {expandedSection === 'message' && <SectionRequests urgent={record.UrgentRequest} record={record} />}
        {/* {expandedSection === 'file' && <SectionAttachment record={record} />} */}
      </div>
    </>
  )
}

export default RecordItem
