const addLocalStorage = (data:object) => {
  for (let k of Object.keys(data)){
    // @ts-ignore
    const value = data[k]

    if (value === null) {
      //null returned from response, and not undefined
      window.localStorage.removeItem(k);
    } else if (value) {
      window.localStorage.setItem(k, JSON.stringify(value));
      
      if(k === 'signedUser'){
        //add signedUser to array of signedUsers
        const local = window.localStorage.getItem('signedUsers')
        const signedUsers:{}[] = local ? JSON.parse(local): [];
        if (!signedUsers) {
          //if no signedUsers in localStorage
          window.localStorage.setItem('signedUsers', JSON.stringify([value.email])); //array with one signedUser
        } else if (!signedUsers.find((u) => u === value.email)) {
          //array without our signedUser
          signedUsers.push(value.email);
          window.localStorage.setItem('signedUsers', JSON.stringify(signedUsers));
        }
        //for socket signedUserName
        window.localStorage.setItem('socketUserName', value.firstName + ' ' + value.lastName);
      
      }
    }
  }

};
export default addLocalStorage;
