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

const sidebar = document.querySelector('.js-sidebar')
const pagination = document.querySelector('.js-pagination')
 
const btnsSortByGender = document.querySelectorAll('.js-sort-gender-btn') // Кнопки выбора гендера
const btnSortByABC = document.querySelector('.js-sort-abc-btn') // Кнопка сортировки по алфавиту
const cleanFiltersBtn = document.querySelector('.js-clean-filters') // Кнопка очиски фильтров
const btnsSortByAge = document.querySelectorAll('.js-sort-age-btn')

const checkGender = document.querySelector('.js-gender')
const checkAbc = document.querySelector('.js-abc')
const checkAge = document.querySelector('.js-age')
let checkPhoneCodes = [];


let dataUsers; // Когда будет запрос на сервер в переменную запишуться данные.
let dataUsersSorted; // Когда будет выбран фильтр сюда запишуться данные


//=====================================================================================================//

loadUsersBtn.addEventListener('click', () => {
  toggleElements(loadUsersBtn, true) // Скрывает кнопку "Загрузить"
  toggleElements(preloader, false) // Показывает лоадер

  const promise = getUsers(randomInteger(1, 100))
  .then(response => response.json())
  .then(data => {
    dataUsers = data.results // Записываем данные в переменную
    createUsers(dataUsers) // Создаём вёрстку пользователей на основе данных

    createFilters()
    createSidebar()
    createPagination()

    createFiltersPhoneCode(dataUsers)
    checkNumberAges(dataUsers) // Ф-ция отключения фильтров где выборка 0
    checkNumberGenders(dataUsers) // Ф-ция отключения фильтров где выборка 0
  })
})

function createUsers(arr){ // Функция построения пользователей которая принимает массив объектов
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

  createStatistic(arr) // Ф-ция которая создаёт статистику
}

function createFilters(){
  toggleElements(filters, false)
}

function createSidebar(){
  toggleElements(sidebar, false)
}

function createPagination(){
  toggleElements(pagination, false)
}


//===============================================statistic====================================///
  

function createStatistic(arr){ // Ф-ция построенния статистики
  toggleElements(statistic, false) // Показываем блок статистики
  document.querySelector('.js-statistic__amount').textContent = arr.length // Выводим количество пользователей
  document.querySelector('.js-statistic__female').textContent = countGender(arr).female // Стучимся в ф-цию и получаем объект с ключем

  document.querySelector('.js-statistic__male').textContent = countGender(arr).male // Стучимся в ф-цию и получаем объект с ключем

  document.querySelector('.js-statistic__result').textContent = countGender(arr).total // Стучимся в ф-цию и получаем объект результатом

  createNation(arr) // Запускаем ф-ция построения блока национальностей
}

function countGender(arr){ // Ф-ция подсчёта м/ж
  let obj = {
    male: 0,
    female: 0,
    total: ''
  }

  arr.forEach(card => {
    card.gender == 'male' ? obj.male++ : obj.female++
  })
  
  if(obj.male > obj.female){
    obj.total = 'Мужчин'
  }else if(obj.male == obj.female){
    obj.total = 'Поровну'
  }else if(obj.male < obj.female){
    obj.total = 'Женщин'
  }

  return obj
}


function createNation(arr){ // Ф-ция создания блока национальностей
  cleanNation() // Чистим на случай если блок был уже построен
  let obj = countNations(arr) // Сохраняем результат выполнения ф-ции это объект с ключом националности и количество

  const parent = document.querySelector('.js-statistic__nations')
  const template = document.querySelector('#statistic-nation')
  let frag = document.createDocumentFragment()

  for(let key in obj){
    let elem = template.content.cloneNode(true)
    elem.querySelector('.js-statistic__nation-text').textContent = key

    if(obj[key] == 1){
      elem.querySelector('.js-statistic__nation-num').textContent =': ' + obj[key] + '-' + 'Пользователь'
    }else if(obj[key] >= 2 && obj[key] <= 4){
      elem.querySelector('.js-statistic__nation-num').textContent =': ' + obj[key] + '-' + 'Пользователя'
    }else if(obj[key] > 4){
      elem.querySelector('.js-statistic__nation-num').textContent =': ' + obj[key] + '-' + 'Пользователей'
    }

    frag.appendChild(elem)
  }

  parent.appendChild(frag)
}

function countNations(arr){ // Ф-ция подсчёта национальностей
  let result = {}

  for(let obj of arr){
    obj.nat in result ? result[obj.nat]++ : result[obj.nat] = 1
  }

  return result
}

function cleanNation(){ // Ф-ция очистки блока национлайьностей 
  const parent = document.querySelector('.js-statistic__nations')
  while(parent.firstChild){ // Вопрос как сделать более оптимизированно?
    parent.firstChild.remove()
  }
}


//====================================filters=================================================//

filtersInput.addEventListener('click', function(){
  searchUsers(this, dataUsers) // Запускаем ф-ция сортировки которая принимает инпут и мейн данные т.к приоритет наивысший
   
})


function searchUsers(input, arr){ // Функия поиска пользователей которая принимает инпут и массив объектов
  input.oninput = function(){ // Срабатывает при изменении инпута

    document.querySelector('.js-radio-gender-default').checked = true
    document.querySelector('.js-radio-age-default').checked = true
    document.querySelector('.js-sort-abc-btn').checked = false


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
    checkGender.dataset.gender = gender // Устанавливает кнопке сортиров по алфавиту гендер который выбран

    checkFilters(this)
  })
})

btnSortByABC.addEventListener('click', function(){
  checkFilters(this)
})


btnsSortByAge.forEach(btn => {
  btn.addEventListener('click', function(){
    let age = this.dataset.age
    checkAge.dataset.age = age
    checkFilters()
  })
})


function checkFilters(){ // Главная ф-ция фильтров, запускается при нажатии на любой фильтр
  cleanUsers()
  deleteSearchInput()

  dataUsersSorted = [...dataUsers]

  if(checkGender.dataset.gender != 'default'){
    dataUsersSorted = [...sortByGender(checkGender.dataset.gender, dataUsersSorted)]
  }

  
  if(btnSortByABC.checked){
    dataUsersSorted = [...sortByAbc(dataUsersSorted)]
  }

  if(checkAge.dataset.age != 'default'){
    dataUsersSorted = [...sortByAge(checkAge.dataset.age, dataUsersSorted)]
  }

  if(checkPhoneCodes > 0){
    dataUsersSorted = [...sortByPhoneCode(dataUsersSorted)]
  }

  createUsers(dataUsersSorted)
}





function sortByGender(gender, arr) { // Ф-ция сортировки по гендеру которая принимает гендер который нужно отсортировать
  let result = [] // Массив выходных данных

  arr.forEach(card => {
    if(card.gender == gender || gender == 'default'){
      result.push(card)
    }
  })

  return result
}





function sortByAbc(arr){ // Ф-ция сортировки по алфавиту
  let result = [...arr]  // Копируем массив
  result.sort((a,b) => a.name.title + a.name.first + a.name.last > b.name.title + b.name.first + b.name.last ? 1 : -1)

  return result
}





function sortByAge(age, arr){ // Ф-ция фолтра по возрасту, принимает возраст который сортируем

  let result = [...arr]

  arr.forEach(card => {
    if(age == 'js-young'){
      result = result.filter(card => card.dob.age <= 34)
    }else if(age == 'js-adult'){
      result = result.filter(card => card.dob.age >= 35 && card.dob.age <= 39)
    }else if(age == 'js-near-old'){
      result = result.filter(card => card.dob.age >= 40 && card.dob.age <= 44)
    }else if(age == 'js-old'){
      result = result.filter(card => card.dob.age >= 45)
    }
  })

  return result
}




cleanFiltersBtn.addEventListener('click', function(){
  cleanUsers() // Ф-ция удаление пользователей
  cleanFilters() // Ф-ция удаления фильтров
  createUsers(dataUsers) // Создаём пользоветелей без фильтров
})





function cleanFilters(){ // Ф-ция очистки филтров
  deleteSearchInput()
  document.querySelector('.js-sort-abc-btn').checked = false
  document.querySelector('.js-radio-gender-default').checked = true
  checkAge.dataset.age = 'default'
  checkGender.dataset.age = 'default'
  document.querySelector('.js-radio-age-default').checked = true
  cleanPhoneCodeFilters()

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

//==================================================================================================//

function checkNumberAges(arr){ // Ф-ция отключения фильтра если выборка 0
  btnsSortByAge.forEach(btn => {
    let result = [...arr]
 
    if(btn.dataset.age == 'js-young'){
      result = result.filter(card => card.dob.age <= 34)

      if(result.length == 0){
        btn.disabled = true
      }
    }else if(btn.dataset.age == 'js-adult'){
      result = result.filter(card => card.dob.age >= 35 && card.dob.age <= 39)

      if(result.length == 0){
        btn.disabled = true
      }
    }else if(btn.dataset.age == 'js-near-old'){
      result = result.filter(card => card.dob.age >= 40 && card.dob.age <= 44)

      if(result.length == 0){
        btn.disabled = true
      }

    }else if(btn.dataset.age == 'js-old'){
      result = result.filter(card => card.dob.age >= 45)

      if(result.length == 0){
        btn.disabled = true
      }
    }
  })
}

function checkNumberGenders(arr){ // Ф-ция отключения выборки если выборка 0
  btnsSortByGender.forEach(btn => {
    let obj = countGender(arr)
    if(obj[btn.dataset.gender] == 0){
      btn.disabled = true
    }
  })
}

function deleteSearchInput(){
  filtersInput.value = ''
  toggleInputFilters(false)
}

function createFiltersPhoneCode(arr){
  const parent = document.querySelector('.js-phone-code')
  let template = document.querySelector('#sidebar-label')
  let frag = document.createDocumentFragment()

  let checkObj = {}

  arr.forEach(obj => {
    
    if(obj.nat in checkObj == false){
      checkObj[obj.nat] = 1
      let filter = template.content.cloneNode(true)
      filter.querySelector('.js-sort-code-text').textContent = obj.nat
      filter.querySelector('.js-sort-phoneCode-btn').dataset.code = obj.nat
      frag.appendChild(filter)
    }
  })

  parent.appendChild(frag)

  gatherPhoneCodeBtns()
}

function gatherPhoneCodeBtns(){
  const btns = document.querySelectorAll('.js-sort-phoneCode-btn')

  btns.forEach(btn => {
    btn.addEventListener('click', function(){
      btn.checked ? checkPhoneCodes++ : checkPhoneCodes--
      checkFilters()
    })
  })
}

function sortByPhoneCode(arr){
  const btns = document.querySelectorAll('.js-sort-phoneCode-btn')

  let result = []
  let codes = []

  btns.forEach(btn => {
    if(btn.checked){
      codes.push(btn.dataset.code)
    }
  })

  codes.forEach(code => {
    arr.forEach(card => {
      if(code == card.nat){
        result.push(card)
      }
    })
  })
 
  return result
}

function cleanPhoneCodeFilters(){
  const btns = document.querySelectorAll('.js-sort-phoneCode-btn')
  btns.forEach(btn => {
    btn.checked = false
  })
}