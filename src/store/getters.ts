const getters = {
  subjectList: state => state.common.subjectList,
  subject: state => { return state.common.subject },
  userInfo: state => state.user.userInfo
}
export default getters
