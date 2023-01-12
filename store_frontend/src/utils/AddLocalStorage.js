
const AddLocalStorage = (data) => {
  const user = {...data.user}
  if (user === null){ //null returned from response, and not undefined
    window.localStorage.removeItem('user')
  } else if (user){
    //remove role from localStorage
    delete user.role
    //Add user to localStorage
    window.localStorage.setItem('user',JSON.stringify(user))
    //add user to array of users
    const users = JSON.parse(window.localStorage.getItem('users'))
    if (!users) { //if no users in localStorage
      window.localStorage.setItem('users', JSON.stringify([user.email])) //array with one user
    } else if (!users.find(u => u === user.email)) { //array without our user
      users.push(user.email)
      window.localStorage.setItem('users', JSON.stringify(users))
    }
    //for socket userName
    window.localStorage.setItem('socketUserName', user.firstName + ' ' + user.lastName)
  }
}
export default AddLocalStorage