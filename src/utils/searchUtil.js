const filterSearch = ({ searchTerm, r }) => {
  const escaped = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const rx = new RegExp(escaped, 'gi')
  return (
    rx.test(r.CaseName) ||
    rx.test(r.CounselFileNumber) ||
    rx.test(r.recordId) ||
    rx.test(r['GS JudgmentMaster::JudgmentRecordingState']) ||
    rx.test(r.JudgmentState) ||
    rx.test(r.LegalActionStatus) ||
    rx.test(r.LegalActionStatusDate) ||
    rx.test(r.LegalActionStatusDateFormatted) ||
    rx.test(r.UpdateRequestDate) ||
    rx.test(r.UpdateRequestDateFormatted) ||
    rx.test(r.UpdateResponseDate) ||
    rx.test(r.UpdateResponseDateFormatted)
  )
}

export default filterSearch
