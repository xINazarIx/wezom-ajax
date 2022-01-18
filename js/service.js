function getUsers(users){
  const promise = fetch(`https://randomuser.me/api/?results=${users}`) // users = Количество пользователей
  return promise // Выкидываем промис (результат)
}


