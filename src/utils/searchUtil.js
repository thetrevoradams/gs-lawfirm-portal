const filterSearch = ({ searchTerm, r }) => {
  const escaped = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const rx = new RegExp(escaped, 'gi')
  return (
    rx.test(r.CaseName) ||
    rx.test(r.CounselFileNumber) ||
    rx.test(r.recordId) ||
    rx.test(r['JudgmentMaster::JudgmentRecordingState']) ||
    rx.test(r.JudgmentState) ||
    rx.test(r.LegalActionStatus) ||
    rx.test(r.LegalActionStatusDate) ||
    rx.test(r.legalActionStatusDateFormatted) ||
    rx.test(r.UpdateRequestDate) ||
    rx.test(r.updateRequestDateFormatted) ||
    rx.test(r.UpdateResponseDate) ||
    rx.test(r.updateResponseDateFormatted)
  )
}

export default filterSearch
