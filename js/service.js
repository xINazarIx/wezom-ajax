function getUsers(users){
  return fetch(`https://randomuser.me/api/?results=${users}`)
}

