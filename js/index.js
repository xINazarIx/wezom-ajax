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

const btnsSortByGender = document.querySelectorAll('.js-sort-gender-btn')
const btnSortByABC = document.querySelector('.js-sort-abc-btn')
const cleanFiltersBtn = document.querySelector('.js-clean-filters')

let dataUsers; // Когда будет запрос на сервер в переменную запишуться данные.

//=====================================================================================================//

loadUsersBtn.addEventListener('click', () => {
  toggleElements(loadUsersBtn, true) // Скрывает кнопку "Загрузить"
  toggleElements(preloader, false) // Показывает лоадер

  const promise = getUsers(randomInteger(1, 100))
  .then(response => response.json())
  .then(data => {
    dataUsers = data.results // Записываем данные в переменную
    createUsers(dataUsers) // Создаём вёрстку пользователей 
  })
})


function createUsers(arr){
  toggleElements(filters, false) // Показываем блок фильтров
  toggleElements(preloader, true) // Выключаем прилоадер
  
  let frag = document.createDocumentFragment() // Обёрка для user

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
}

//===============================================statistic====================================///





//====================================filters=================================================//

filtersInput.addEventListener('click', function(){ 
  searchUsers(this, dataUsers) // Запускаем ф-ция сортировки
})


function searchUsers(input, arr){
  input.oninput = function(){
    let result = [] // Массив выходных данных
    cleanUsers() // При введение значения будут удалятся все пользователи
    let value = input.value // Получаем значение инпута

    let gender = input.dataset.gender // Проверяем какой гендер сортируем
   
    value = value.toLowerCase().replace(/\s+/g, '') // Делаем значение в нижнем регистре, без пробелов 

    arr.forEach(card => { // Проходимся по всем объектам
      let name = card.name.title + card.name.first + card.name.last // Соединяем имя
      let phone = card.phone
      let email = card.email
      
      name = name.toLowerCase()
      phone = phone.replace(/\s+/g, '').replace(/[^0-9]/g, '');
    
      if(name.search(value) != -1 || phone.search(value) != -1 || email.search(value) != -1){
        if(card.gender == gender || gender == 'all'){
          result.push(card) // Добавляем объект в result если его ключи совпадают с значением инпута
        }
      }
    })

    createUsers(result) // Создаём вёрстку на основе отсортированного массива


    if(value == ''){
      toggleInputFilters(false) // Убираем у инпута поиска класс актив
    }else{
      toggleInputFilters(true) // Добавлям  класс актив у инпута поиска
    }
  }
}



btnsSortByGender.forEach(btn => { // Ф-ция сортировки по гендеру
  btn.addEventListener('click', function(){
    filtersInput.value = '' // На случай если пользователь вводл какое-либо значение
    toggleInputFilters(false) // Убираем у инпута поиска класс актив

    let gender = this.dataset.gender // Получаем дата-атрибут гендера который нужно отсортировать
    sortByGender(gender, dataUsers) // Запускаем ф-цию сортировки


    // -------------------------------------------------//
    btnsSortByGender.forEach(btn => {
      toggleBtnFilters(btn, false) // Убираем класс актив у кнопок
    })

    toggleBtnFilters(btn, true) // Добавляем кнопке класс актив
  })
})


function sortByGender(gender, arr) { // Ф-ция сортиров по гендеру которая принимает гендер который нужно отсортировать
  let result = [] // Массив выходных данных
  cleanUsers()

  filtersInput.dataset.gender = gender // Устанавливаем сначение дата-атрибута какой гендер сейчас ищем по-умолчанию all

  arr.forEach(card => {
    if(card.gender == gender){
      result.push(card)
    }
  })

  createUsers(result)
}



btnSortByABC.addEventListener('click', function(){
  sortByAbc(dataUsers)
  toggleBtnSortByABC(true) // Добавляем кнопке класс актив
})


function sortByAbc(arr){ // Ф-ция сортировки по алфавиту
  let result = JSON.parse(JSON.stringify(arr)); // Копируем массив
  result.sort((a,b) => a.name.title + a.name.first + a.name.last > b.name.title + b.name.first + b.name.last ? 1 : -1)
  cleanUsers()
  createUsers(result)
}

cleanFiltersBtn.addEventListener('click', function(){
  cleanUsers() // Ф-ция удаление пользователей
  cleanFilters() // Ф-ция очистики фильтров
  createUsers(dataUsers) // Создаём пользоветелей без фильтров
})

function cleanFilters(){
  filtersInput.value = ''
  filtersInput.dataset.gender = 'all'
  toggleBtnSortByABC(false)
  toggleInputFilters(false)
  btnsSortByGender.forEach(btn => toggleBtnFilters(btn, false))
}

function cleanUsers(){
  const parent = document.querySelector('.js-users') // Вопрос, как можно более оптимизированно собрать всех и удалить
  while(parent.firstChild){
    parent.firstChild.remove()
  }
}

//==================================================================================================//

function toggleInputFilters(flag){
  filtersInput.classList.toggle('filters__search--active', flag)
}

function toggleBtnFilters(btn, flag){
  btn.classList.toggle('filters__sort-gender--active', flag)
}

function toggleElements(elem, flag){ // ф-ция "показить" или "скрыть" элемент // true - скрыть, false - показать 
  elem.classList.toggle('hidden', flag)
}

function toggleBtnSortByABC(flag){
  btnSortByABC.classList.toggle('filters__sort-abc--active', flag)
}