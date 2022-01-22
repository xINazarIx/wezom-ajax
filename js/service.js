let i = 0;

function getUsers(users){
  let arr = [`err`, `https://randomuser.me/api/?results=${users}`]
  return fetch(arr[i++])
}


