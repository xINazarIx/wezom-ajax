const parent = document.querySelector('.js-users')
const loadUsersBtn = document.querySelector('.js-btn')
const resetUsersBtn = document.querySelector('.js-btn--reset')
const preloader = document.querySelector('.js-preloader')
const template = document.querySelector('#js-user')
const statistic = document.querySelector('.js-statistic')
const filters = document.querySelector('.js-filters')
const filtersInput = document.querySelector('.js-filters__search')

const error = document.querySelector('.js-error') // Dom element ошибки
const errorText = document.querySelector('.js-error').firstElementChild // Dom element текста ошибки



//=====================================================================================================//

function switchElements(elem, flag){ // ф-ция "показить" или "скрыть" элемент // true - скрыть, false - показать 
  elem.classList.toggle('hidden', flag)
}


loadUsersBtn.addEventListener('click', () => {
  switchElements(loadUsersBtn, true) // Скрывает кнопку "Загрузить"
  switchElements(preloader, false) // Показывает лоадер

  const promise = getUsers(randomInteger(1, 100))
  .then(response => response.json())
  .then(data => createUsers(data))

})

resetUsersBtn.addEventListener('click', () => {
  switchElements(resetUsersBtn, true) // Скрываем кнопку "Обновить"
  switchElements(preloader, false) // Показываем прелоадер
  switchElements(error, true) // Скрываем окно с ошибкой

  const promise = getUsers(randomInteger(1, 100)) // Делаем запрос на сервер => Получаем промис
  .then(response => response.json())
  .then(data => createUsers(data))
  .catch(error => getUsersError(error))
})


function createUsers(arr) {
  switchElements(filters, false)
  switchElements(preloader, true) // Выключаем прилоадер
  
  let frag = document.createDocumentFragment() // Обёрка для user
  data.results.forEach(elem => { // Цикл по результату запроса
  arr.forEach(elem => { // Цикл по результату запроса
    let user = template.content.cloneNode(true) // Клонируем темплейт 

    user.querySelector('.js-user-card__img').src = elem.picture.large
    user.querySelector('.js-user-card__name').textContent = ''
    for (let key in elem.name) {
      user.querySelector('.js-user-card__name').textContent += ' ' + elem.name[key]
    }
    user.querySelector('.js-user-card__gender').textContent = elem.gender
    user.querySelector('.js-user-card__gender').dataset.gender = elem.gender
    user.querySelector('.js-user-card__number').textContent = elem.phone
    user.querySelector('.js-user-card__number').href = 'tel:' + elem.phone
    user.querySelector('.js-user-card__email').textContent = elem.email
    user.querySelector('.js-user-card__email').href = 'mailto:' + elem.email
    user.querySelector('.js-user-card__location div').textContent = `${elem.location.city}, ${elem.location.street.name},`
    user.querySelector('.js-user-card__location span').textContent = elem.location.street.number
    user.querySelector('.js-user-card__birthday span').textContent = new Date(elem.dob.date).toLocaleDateString('ru')
    user.querySelector('.js-user-card__reg span').textContent = new Date(elem.registered.date).toLocaleDateString('ru')

    frag.appendChild(user) // Вставляем элемент в обёртку которой нету в Dom
  })

  parent.appendChild(frag) // Вставляем элемент в Dom
  
  createStatistic(data.info.results, calculateGender(data.results),calculateNations(data.results)) // Запускаем ф-цию статистики // передаём число пользователей, функцию которая вернёт объёкт с результатом (94), функцию которая вернёт объёкт с результатом национальностей
}

function getUsersError(err){ // Ф-ция обработки ошибки
  setTimeout(() => {
    switchElements(error, false) // Показывает Dom элемент
    errorText.innerHTML = err // Вставляем текст ошибки в Dom элемент
    switchElements(resetUsersBtn, false) // Показываем кнопку
    switchElements(preloader, true) // Скрываем прелоадер
  }, 1000) // Для наглядности
}





//===============================================statistic====================================///

function createStatistic(amount, objGender, objNations){ // Функция построения статистики
  switchElements(statistic, false) // Показывает блок статистика
  document.querySelector('.js-statistic__amount').innerHTML = amount // параметр количество пользователей
  document.querySelector('.js-statistic__female').innerHTML = objGender.female // ключ количество женщин
  document.querySelector('.js-statistic__male').innerHTML = objGender.male // ключ количество мужчин
  document.querySelector('.js-statistic__result').innerHTML = objGender.total // ключ итога

  const parent = document.querySelector('.js-statistic')
  const template = document.querySelector('#statistic-nation')

  let frag = document.createDocumentFragment()

  for(let key in objNations){
    let elem = template.content.cloneNode(true)
    elem.querySelector('.js-statistic__nation-text').innerHTML = key

    if(objNations[key] == 1){ // Как правильно оформить??
      elem.querySelector('.js-statistic__nation-num').innerHTML =': ' + objNations[key] + '-' + 'Пользователь'
    }else if(objNations[key] >= 2 && objNations[key] <= 4){
      elem.querySelector('.js-statistic__nation-num').innerHTML =': ' + objNations[key] + '-' + 'Пользователя'
    }else if(objNations[key] > 4){
      elem.querySelector('.js-statistic__nation-num').innerHTML =': ' + objNations[key] + '-' + 'Пользователей'
    }

    frag.appendChild(elem)
  }
  parent.appendChild(frag)

}

function calculateGender(arr){ // Ф-ция подсчёта женщин и мужчин
  let result = {
    male: 0,
    female: 0,
    total: '',

    count(){
      for(let obj of arr){
        obj.gender == 'male' ? this.male++ : this.female++
      }
    },
    
    resultTotal(){
      if(this.male > this.female){
        this.total = 'Мужчин'
      }else if(this.male < this.female){
        this.total = 'Женщин'
      }else if(this.male == this.female){
        this.total = 'Поровну'
      }
    }
  } 

  result.count()
  result.resultTotal()

  return result
}

function calculateNations(arr){ // Ф-ция подсчёта национальностей
  let result = {}

  for(let obj of arr){
    obj.nat in result ? result[obj.nat]++ : result[obj.nat] = 1
  }
  
  return result
}






//====================================filters=================================================//

filtersInput.addEventListener('click', function(){
  searchUsers(this)
})


function searchUsers(input){
  const arr = document.querySelectorAll('.js-user-card')
  
  input.oninput = function(){
    let value = input.value // Позволяет не записывать пробелы

    arr.forEach(card => {
      switchElements(card, false)
      let nameText = card.querySelector('.js-user-card__name').innerText.toLowerCase().replace(/\s+/g, '');
      let phoneText = card.querySelector('.js-user-card__number').innerText.toLowerCase().replace(/\s+/g, '');
      let emailText = card.querySelector('.js-user-card__email').innerText.toLowerCase().replace(/\s+/g, '');

      value = value.toLowerCase().replace(/\s+/g, '');

      if(nameText.search(value) == -1 && phoneText.search(value) == -1 && emailText.search(value) == -1){
        switchElements(card, true)
      }
    })
  }
}
