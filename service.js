function getUsers(users, callback){
  fetch(`https://randomuser.me/api/?results=${users}`) // users = Количество пользователей
  .then(response => response.json())
  .then(data => callback(data)) // Передаём данные в нужную функцию на уровне UI
}


