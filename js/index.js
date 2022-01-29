const parent = document.querySelector('.js-users')
const loadUsersBtn = document.querySelector('.js-btn') // Кнопка загрузить
const resetUsersBtn = document.querySelector('.js-btn--reset') // Кнопка обновить 
const preloader = document.querySelector('.js-preloader') // Прелоадер
const template = document.querySelector('#js-user') // Карточка user 

const statistic = document.querySelector('.js-statistic') // Блок статистики

const filters = document.querySelector('.js-filters') // Блок фильтров 
const filtersInput = document.querySelector('.js-filters__search') // Поиск-интуп

const error = document.querySelector('.js-error') // Блок ошибки
const errorText = document.querySelector('.js-error').firstElementChild // Текст ошибки

const btnsSortByGender = document.querySelectorAll('.js-sort-gender-btn') // Кнопки выбопра гендера
const btnSortByABC = document.querySelector('.js-sort-abc-btn') // Кнопка сортировки по алфавиту
const cleanFiltersBtn = document.querySelector('.js-clean-filters') // Кнопка очиски фильтров

let dataUsers; // Когда будет запрос на сервер в переменную запишуться данные.
let dataUsersSorted // Когда будет выбран фильтр сюда запишуться данные




//=====================================================================================================//

loadUsersBtn.addEventListener('click', () => {
  toggleElements(loadUsersBtn, true) // Скрывает кнопку "Загрузить"
  toggleElements(preloader, false) // Показывает лоадер

  const promise = getUsers(randomInteger(1, 100))
  .then(response => response.json())
  .then(data => {
    dataUsers = data.results // Записываем данные в переменную
    createUsers(dataUsers) // Создаём вёрстку пользователей на основе данных
  })
})


function createUsers(arr){ // Функция построения пользователей которая принимает массив объектов
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
  searchUsers(this, dataUsers) // Запускаем ф-ция сортировки которая принимает инпут и мейн данные т.к приоритет наивысший 
})


function searchUsers(input, arr){ // Функия поиска пользователей которая принимает инпут и массив объектов
  input.oninput = function(){ // Срабатывает при изменении инпута

    btnsSortByGender.forEach(btn => toggleBtnFilters(btn, false)) // На случай если пользователь выбирал фильтр
    toggleBtnSortByABC(false) // Убираем класс актив

    btnSortByABC.dataset.check = 'false'; // Даём возомжность нажимать на кнопку
    btnSortByABC.dataset.gender = 'all'; // делаем дата-атрибут поиск по всем гендерам

    let result = [] // Массив выходных данных
    cleanUsers() // Ф-ция чистит всех пользователей

    let value = input.value // Получаем значение инпута
    value = value.toLowerCase().replace(/\s+/g, '') // Делаем значение в нижнем регистре, без пробелов 

    arr.forEach(card => { // Проходимся по всем объектам
      let name = card.name.title + card.name.first + card.name.last // Соединяем имя
      let phone = card.phone
      let email = card.email
      
      name = name.toLowerCase()
      phone = phone.replace(/\s+/g, '').replace(/[^0-9]/g, '');
    
      if(name.search(value) != -1 || phone.search(value) != -1 || email.search(value) != -1){
        result.push(card) // Если данные сходятся добавляем в result
      }
    })

    createUsers(result) // Создаём вёрстку на основе отсортированного массива
    dataUsersSorted = [...result] // Делаем сортированный массив c данными result

    if(value == ''){
      toggleInputFilters(false) // Убираем у инпута поиска класс актив
    }else{
      toggleInputFilters(true) // Добавлям  класс актив у инпута поиска
    }
  }
}



btnsSortByGender.forEach(btn => { // Ф-ция сортировки по гендеру
  btn.addEventListener('click', function(){

    let gender = this.dataset.gender // Получаем дата-атрибут гендера который нужно отсортировать
    btnSortByABC.dataset.gender = gender // Устанавливает кнопке сортиров по алфавиту гендер который выбран

    dataUsersSorted === undefined ? sortByGender(gender, dataUsers) : sortByGender(gender, dataUsersSorted)
    // Если пользователь не вводил данные отдаём массив дефолтных данных, если вводил отдаём массив сортированных данных

    // -------------------------------------------------//
    btnsSortByGender.forEach(btn => {
      toggleBtnFilters(btn, false) // Убираем класс актив у кнопок
    })

    toggleBtnFilters(btn, true) // Добавляем кнопке класс актив
  })
})


function sortByGender(gender, arr) { // Ф-ция сортировки по гендеру которая принимает гендер который нужно отсортировать

  let result = [] // Массив выходных данных
  cleanUsers() // Чистит пользователей

  arr.forEach(card => {
    if(card.gender == gender || gender == 'all'){
      result.push(card)
    }
  })

  createUsers(result)
}



btnSortByABC.addEventListener('click', function(){
  let gender = this.dataset.gender // Получаем гендер который нужно учесть при сортирови, по умолчанию 'all'

  if(this.dataset.check == 'false'){ // Если на кнопку нажимали, запрещаем нажимать еще раз
    dataUsersSorted === undefined ? sortByAbc(dataUsers, gender) : sortByAbc(dataUsersSorted, gender)
    // Если пользователь не нажимал на фильтры отдаем дефолтный массив
    toggleBtnSortByABC(true) // Добавляем кнопке класс актив
    this.dataset.check = 'true' // Меням атрибут на true
  }

})


function sortByAbc(arr, gender){ // Ф-ция сортировки по алфавиту
  cleanUsers() // Ф-ция удаления пользователей
  let result = [...arr]  // Копируем массив
  result.sort((a,b) => a.name.title + a.name.first + a.name.last > b.name.title + b.name.first + b.name.last ? 1 : -1)
  dataUsersSorted = [...result] // Записываем сортированные данные

  sortByGender(gender, dataUsersSorted) // Нужно запустить эту ф-цию чтобы учесть гендер
}


cleanFiltersBtn.addEventListener('click', function(){
  cleanUsers() // Ф-ция удаление пользователей
  cleanFilters() // Ф-ция удаления фильтров
  createUsers(dataUsers) // Создаём пользоветелей без фильтров
})

function cleanFilters(){
  filtersInput.value = '' // Значения поиска делаем пустое
  toggleBtnSortByABC(false) // Удаляем класс актив у кнопки сорт. по-алфавиту
  toggleInputFilters(false) // Удаляем класс актив инпута поиска
  btnsSortByGender.forEach(btn => toggleBtnFilters(btn, false)) // Удаляем класс актив у кнопок сорт. по-гендеру


  btnSortByABC.dataset.gender = 'all' // Кнопке сортировки по алфавиту делаем атрибут 'всех'
  btnSortByABC.dataset.check = 'false' // Отменяем нажатие по єтой кнопке


  dataUsersSorted = undefined // Делаем сортированные дынные пустыми
}

function cleanUsers(){  //  Ф-ция удаления пользователей
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

function toggleElements(elem, flag){
  elem.classList.toggle('hidden', flag)
}

function toggleBtnSortByABC(flag){
  btnSortByABC.classList.toggle('filters__sort-abc--active', flag)
}