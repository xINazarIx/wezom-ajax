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

  const promise = getUsers(randomInteger(95, 100))
    .then(response => response.json())
    .then(data => {
      dataUsers = data.results // Записываем данные в переменную

      createPage(dataUsers)

      createFilters()
      createSidebar()


      createFiltersPhoneCode(dataUsers)
      checkNumberAges(dataUsers) // Ф-ция отключения фильтров где выборка 0
      checkNumberGenders(dataUsers) // Ф-ция отключения фильтров где выборка 0
    })
})

function createUsers(arr) { // Функция построения пользователей которая принимает массив объектов
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

  dataUsersSorted == undefined ? createStatistic(dataUsers) : createStatistic(dataUsersSorted)
}

function createFilters() {
  toggleElements(filters, false)
}

function createSidebar() {
  toggleElements(sidebar, false)
}

//===============================================statistic====================================///


function createStatistic(arr) { // Ф-ция построенния статистики
  toggleElements(statistic, false) // Показываем блок статистики
  document.querySelector('.js-statistic__amount').textContent = arr.length // Выводим количество пользователей
  document.querySelector('.js-statistic__female').textContent = countGender(arr).female // Стучимся в ф-цию и получаем объект с ключем

  document.querySelector('.js-statistic__male').textContent = countGender(arr).male // Стучимся в ф-цию и получаем объект с ключем

  document.querySelector('.js-statistic__result').textContent = countGender(arr).total // Стучимся в ф-цию и получаем объект результатом

  createNation(arr) // Запускаем ф-ция построения блока национальностей
}

function countGender(arr) { // Ф-ция подсчёта м/ж
  let obj = {
    male: 0,
    female: 0,
    total: ''
  }

  arr.forEach(card => {
    card.gender == 'male' ? obj.male++ : obj.female++
  })

  if (obj.male > obj.female) {
    obj.total = 'Мужчин'
  } else if (obj.male == obj.female) {
    obj.total = 'Поровну'
  } else if (obj.male < obj.female) {
    obj.total = 'Женщин'
  }

  return obj
}


function createNation(arr) { // Ф-ция создания блока национальностей
  cleanNation() // Чистим на случай если блок был уже построен
  let obj = countNations(arr) // Сохраняем результат выполнения ф-ции это объект с ключом националности и количество

  const parent = document.querySelector('.js-statistic__nations')
  const template = document.querySelector('#statistic-nation')
  let frag = document.createDocumentFragment()

  for (let key in obj) {
    let elem = template.content.cloneNode(true)
    elem.querySelector('.js-statistic__nation-text').textContent = key

    if (obj[key] == 1) {
      elem.querySelector('.js-statistic__nation-num').textContent = ': ' + obj[key] + '-' + 'Пользователь'
    } else if (obj[key] >= 2 && obj[key] <= 4) {
      elem.querySelector('.js-statistic__nation-num').textContent = ': ' + obj[key] + '-' + 'Пользователя'
    } else if (obj[key] > 4) {
      elem.querySelector('.js-statistic__nation-num').textContent = ': ' + obj[key] + '-' + 'Пользователей'
    }

    frag.appendChild(elem)
  }

  parent.appendChild(frag)
}

function countNations(arr) { // Ф-ция подсчёта национальностей
  let result = {}

  for (let obj of arr) {
    obj.nat in result ? result[obj.nat]++ : result[obj.nat] = 1
  }

  return result
}

function cleanNation() { // Ф-ция очистки блока национлайьностей 
  const parent = document.querySelector('.js-statistic__nations')
  while (parent.firstChild) { // Вопрос как сделать более оптимизированно?
    parent.firstChild.remove()
  }
}


//====================================filters=================================================//

filtersInput.addEventListener('click', function () {
  searchUsers(this, dataUsers) // Запускаем ф-ция сортировки которая принимает инпут и мейн данные т.к приоритет наивысший
})


function searchUsers(input, arr) { // Функия поиска пользователей которая принимает инпут и массив объектов
  input.oninput = function () { // Срабатывает при изменении инпута

    cleanFiltersLocal()


    let result = [] // Массив выходных данных

    cleanUsers() // Ф-ция чистит всех пользователей

    let value = input.value // Получаем значение инпута

    value == '' ? hiddenAllUsers() : showAllUsers()

    value = value.toLowerCase().replace(/\s+/g, '') // Делаем значение в нижнем регистре, без пробелов 

    arr.forEach(card => { // Проходимся по всем объектам
      let name = card.name.title + card.name.first + card.name.last // Соединяем имя
      let phone = card.phone
      let email = card.email

      name = name.toLowerCase()
      phone = phone.replace(/\s+/g, '').replace(/[^0-9]/g, '');

      if (name.search(value) != -1 || phone.search(value) != -1 || email.search(value) != -1) {
        result.push(card) // Если данные сходятся добавляем в result
      }
    })

    createPage(result)


    if (value == '') {
      toggleInputFilters(false) // Убираем у инпута поиска класс актив
    } else {
      toggleInputFilters(true) // Добавлям  класс актив у инпута поиска
    }
  }
}



btnsSortByGender.forEach(btn => { // Ф-ция сортировки по гендеру
  btn.addEventListener('click', function () {
    let gender = this.dataset.gender // Получаем дата-атрибут гендера который нужно отсортировать
    checkGender.dataset.gender = gender // Устанавливает кнопке сортиров по алфавиту гендер который выбран

    checkFilters()
  })
})

btnSortByABC.addEventListener('click', function () {

  checkFilters()
})


btnsSortByAge.forEach(btn => {
  btn.addEventListener('click', function () {
    let age = this.dataset.age
    checkAge.dataset.age = age
    checkFilters()
  })
})


function checkFilters() { // Главная ф-ция фильтров, запускается при нажатии на любой фильтр
  cleanUsers()
  deleteSearchInput()

  dataUsersSorted = [...dataUsers]

  if (checkGender.dataset.gender != 'default') {
    dataUsersSorted = [...sortByGender(checkGender.dataset.gender, dataUsersSorted)]
  }


  if (btnSortByABC.checked) {
    dataUsersSorted = [...sortByAbc(dataUsersSorted)]
  }

  if (checkAge.dataset.age != 'default') {
    dataUsersSorted = [...sortByAge(checkAge.dataset.age, dataUsersSorted)]
  }

  if (checkPhoneCodes > 0) {
    dataUsersSorted = [...sortByPhoneCode(dataUsersSorted)]
  }

  if (dataCheck == 'default') {
    hiddenAllUsers()
  }

  pageDefault()
  createPage(dataUsersSorted)
}





function sortByGender(gender, arr) { // Ф-ция сортировки по гендеру которая принимает гендер который нужно отсортировать
  let result = [] // Массив выходных данных

  arr.forEach(card => {
    if (card.gender == gender || gender == 'default') {
      result.push(card)
    }
  })

  return result
}





function sortByAbc(arr) { // Ф-ция сортировки по алфавиту
  let result = [...arr]  // Копируем массив
  result.sort((a, b) => a.name.title + a.name.first + a.name.last > b.name.title + b.name.first + b.name.last ? 1 : -1)

  return result
}





function sortByAge(age, arr) { // Ф-ция фолтра по возрасту, принимает возраст который сортируем

  let result = [...arr]

  arr.forEach(card => {
    if (age == 'js-young') {
      result = result.filter(card => card.dob.age <= 34)
    } else if (age == 'js-adult') {
      result = result.filter(card => card.dob.age >= 35 && card.dob.age <= 39)
    } else if (age == 'js-near-old') {
      result = result.filter(card => card.dob.age >= 40 && card.dob.age <= 44)
    } else if (age == 'js-old') {
      result = result.filter(card => card.dob.age >= 45)
    }
  })

  return result
}




cleanFiltersBtn.addEventListener('click', function () {
  cleanUsers() // Ф-ция удаление пользователей
  cleanFiltersGlobal() // Ф-ция удаления фильтров
  cleanUserRender()
  createPage(dataUsers) // Создаём пользоветелей без фильтров
})


function cleanFiltersLocal() {
  document.querySelector('.js-radio-age-default').checked = true
  document.querySelector('.js-sort-abc-btn').checked = false
  document.querySelector('.js-radio-gender-default').checked = true
  document.querySelector('.js-radio-showUsers-default').checked = true

  cleanPhoneCodeFilters()

  checkAge.dataset.age = 'default'
  checkGender.dataset.gender = 'default'
  checkShowUsers.dataset.users = 'default'


  dataUsersSorted = undefined // Делаем сортированные дынные пустыми
}


function cleanFiltersGlobal() { // Ф-ция очистки фильтров
  cleanFiltersLocal()
  deleteSearchInput()
}

function cleanUsers() {  //  Ф-ция удаления пользователей
  const parent = document.querySelector('.js-users') // Вопрос, как можно более оптимизированно собрать всех и удалить
  while (parent.firstChild) {
    parent.firstChild.remove()
  }
}

//==================================================================================================//

function toggleInputFilters(flag) {
  filtersInput.classList.toggle('filters__search--active', flag)
}

function toggleBtnFilters(btn, flag) {
  btn.classList.toggle('filters__sort-gender--active', flag)
}

function toggleElements(elem, flag) {
  elem.classList.toggle('hidden', flag)
}

function toggleBtnSortByABC(flag) {
  btnSortByABC.classList.toggle('filters__sort-abc--active', flag)
}



//==================================================================================================//

function checkNumberAges(arr) { // Ф-ция отключения фильтра если выборка 0
  btnsSortByAge.forEach(btn => {
    let result = [...arr]

    if (btn.dataset.age == 'js-young') {
      result = result.filter(card => card.dob.age <= 34)

      if (result.length == 0) {
        btn.disabled = true
      }
    } else if (btn.dataset.age == 'js-adult') {
      result = result.filter(card => card.dob.age >= 35 && card.dob.age <= 39)

      if (result.length == 0) {
        btn.disabled = true
      }
    } else if (btn.dataset.age == 'js-near-old') {
      result = result.filter(card => card.dob.age >= 40 && card.dob.age <= 44)

      if (result.length == 0) {
        btn.disabled = true
      }

    } else if (btn.dataset.age == 'js-old') {
      result = result.filter(card => card.dob.age >= 45)

      if (result.length == 0) {
        btn.disabled = true
      }
    }
  })
}

function checkNumberGenders(arr) { // Ф-ция отключения выборки если выборка 0
  btnsSortByGender.forEach(btn => {
    let obj = countGender(arr)
    if (obj[btn.dataset.gender] == 0) {
      btn.disabled = true
    }
  })
}

function deleteSearchInput() {
  filtersInput.value = ''
  toggleInputFilters(false)
}

function createFiltersPhoneCode(arr) {
  const parent = document.querySelector('.js-phone-code')
  let template = document.querySelector('#sidebar-label')
  let frag = document.createDocumentFragment()

  let checkObj = {}

  arr.forEach(obj => {

    if (obj.nat in checkObj == false) {
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

function gatherPhoneCodeBtns() {
  const btns = document.querySelectorAll('.js-sort-phoneCode-btn')

  btns.forEach(btn => {
    btn.addEventListener('click', function () {
      btn.checked ? checkPhoneCodes++ : checkPhoneCodes--
      checkFilters()
    })
  })
}

function sortByPhoneCode(arr) {
  const btns = document.querySelectorAll('.js-sort-phoneCode-btn')

  let result = []
  let codes = []

  btns.forEach(btn => {
    if (btn.checked) {
      codes.push(btn.dataset.code)
    }
  })

  codes.forEach(code => {
    arr.forEach(card => {
      if (code == card.nat) {
        result.push(card)
      }
    })
  })

  return result
}

function cleanPhoneCodeFilters() {
  const btns = document.querySelectorAll('.js-sort-phoneCode-btn')

  btns.forEach(btn => {
    btn.checked = false
  })

  checkPhoneCodes = []
}

//================================pagination======================================//

const showMoreBtn = document.querySelector('.js-show-more')
const showUsersRadios = document.querySelectorAll('.js-sortUsersShow')
const pagination = document.querySelector('.js-pagination')

const currentPage = document.querySelector('.js-pagination-inner')

let checkShowUsers = document.querySelector('.js-showUsers')
let dataCheck = checkShowUsers.dataset.users

let userShowed = 6;

showUsersRadios.forEach(btn => {
  btn.addEventListener('click', function () {
    pageDefault()
    changeNumberUsersOnPage(btn)
    deleteSearchInput()
  })
})

showMoreBtn.addEventListener('click', function () {
  userShowed = userShowed + 6
  dataUsersSorted == undefined ? createPage(dataUsers) : createPage(dataUsersSorted)
})

function pageDefault() {
  currentPage.dataset.currentpage = 1
}

function createPage(arr) {
  cleanUsers()
  cleanPaginationLinks()
  сleanPaginationBtns()

  let defaultArr = [...arr]

  dataCheck = checkShowUsers.dataset.users

  if (dataCheck == 'default') {

    arr = renderUsers(arr)
    arr.length >= defaultArr.length ? toggleElements(showMoreBtn, true) : toggleElements(showMoreBtn, false)

  } else if (dataCheck == 'all') {

  }
  else {
    toggleElements(showMoreBtn, true)
    let dataOnPage = parseInt(dataCheck)
    arr = createGlobalPagination(arr, dataOnPage)
  }


  createUsers(arr)
}

function createGlobalPagination(arr, dataOnPage) {
  let page = currentPage.dataset.currentpage

  let countPaginationBtns = Math.ceil(arr.length / dataOnPage)
  let start = (page - 1) * dataOnPage
  let end = start + dataOnPage
  arr = arr.slice(start, end)

  createPaginationBtns(countPaginationBtns)
  switchPaginationLinks()

  return arr
}

function switchPaginationLinks() {
  let activeLink = currentPage.dataset.currentpage
  const paginationLinks = document.querySelectorAll('.js-pagination-link')

  if (paginationLinks.length != 0) {
    paginationLinks.forEach(link => {
      link.classList.remove('pagination__link--active')
    })
    document.querySelector('.js-pagination-link[data-page="' + activeLink + '"]').classList.add('pagination__link--active')
  } else {
    hiddenPaginationBtns()
  }
}



function createPaginationBtns(countPaginationBtns) { // Количество всех кнопок
  showPagination()
  showPaginationBtns()

  let parentOfBtns = document.querySelector('.js-pagination-inner')
  parentOfBtns.dataset.pages = countPaginationBtns

  let localCountBtns = 5 // Количество видемых кнопок

  const parent = document.querySelector('.js-pagination-inner')
  const template = document.querySelector('#pagination-links')
  let frag = document.createDocumentFragment()

  let page = parseInt(currentPage.dataset.currentpage) // Текущая страница

  let left = (page - Math.floor(localCountBtns / 2)) 
  let right = (page + Math.floor(localCountBtns / 2))

  if(left < 1){
    left = 1
    right = localCountBtns
  }

  if(right > countPaginationBtns){
    left = countPaginationBtns - localCountBtns
    right = countPaginationBtns

    if(left < 1){
      left = 1
    }
  }


  for (let i = left; i <= right; i++) {
    let btn = template.content.cloneNode(true)
    btn.querySelector('.js-pagination-link').textContent = i
    btn.querySelector('.js-pagination-link').dataset.page = i

    frag.appendChild(btn)
  }

  if (countPaginationBtns != 1) {
    parent.appendChild(frag)
  }


  
  if(parseInt(currentPage.dataset.currentpage) < 4){
    toggleElements(document.querySelector('.js-pagination-btn[data-page="start"]'), true)
  }

  if(parseInt(currentPage.dataset.currentpage) == 1){
    toggleElements(document.querySelector('.js-pagination-btn[data-page="prev"]'), true)
  }

  if(parseInt(currentPage.dataset.currentpage) == countPaginationBtns){
    toggleElements(document.querySelector('.js-pagination-btn[data-page="next"]'), true)
  }

  if(parseInt(currentPage.dataset.currentpage) >= countPaginationBtns - 2){
    toggleElements(document.querySelector('.js-pagination-btn[data-page="last"]'), true)
  }

  switchPages()
}




function switchPages() {
  pagination.addEventListener('click', paginationEventClick)
}

function paginationEventClick(e) {
  let countOfBtns = document.querySelector('.js-pagination-inner')

  let target = e.target
  if (target.tagName != 'A') return;

  if (target.dataset.page == 'next'){
    let page = parseInt(currentPage.dataset.currentpage)

    if(page < parseInt(countOfBtns.dataset.pages)){
      currentPage.dataset.currentpage = page + 1 
      dataUsersSorted == undefined ? createPage(dataUsers) : createPage(dataUsersSorted)
    }else{
      e.preventDefault()
    }

  }else if(target.dataset.page == 'prev'){
    let page = parseInt(currentPage.dataset.currentpage)

    if(page > 1){
      currentPage.dataset.currentpage = page - 1
      dataUsersSorted == undefined ? createPage(dataUsers) : createPage(dataUsersSorted)
    }else{
      e.preventDefault()
    }

  }else if(target.dataset.page == 'start'){
    let page = parseInt(currentPage.dataset.currentpage)

    if(page != 1){
      currentPage.dataset.currentpage = 1
      dataUsersSorted == undefined ? createPage(dataUsers) : createPage(dataUsersSorted)
    }else{
      e.preventDefault()
    }

  }else if(target.dataset.page == 'last'){

    let page = parseInt(currentPage.dataset.currentpage)

    if(page != parseInt(countOfBtns.dataset.pages)){

      currentPage.dataset.currentpage = parseInt(countOfBtns.dataset.pages)
      dataUsersSorted == undefined ? createPage(dataUsers) : createPage(dataUsersSorted)
    }else{
      e.preventDefault()
    }

  }else{

    currentPage.dataset.currentpage = target.dataset.page
    dataUsersSorted == undefined ? createPage(dataUsers) : createPage(dataUsersSorted)
    
  }
}

function removeEventPagination() {
  pagination.removeEventListener('click', paginationEventClick)
}



function cleanPaginationLinks() {
  const parent = document.querySelector('.js-pagination-inner') // Вопрос, как можно более оптимизированно собрать всех и удалить
  while (parent.firstChild) {
    parent.firstChild.remove()
  }
}

function сleanPaginationBtns() {
  const paginationBtns = document.querySelectorAll('.js-pagination-btn')
  paginationBtns.forEach(btn => {
    toggleElements(btn, true)
  })
}



function changeNumberUsersOnPage(btn) {
  checkShowUsers.dataset.users = btn.dataset.users
  dataUsersSorted == undefined ? createPage(dataUsers) : createPage(dataUsersSorted)
}


function renderUsers(arr) {
  cleanUsers()
  arr = arr.slice(0, userShowed)
  return arr
}

function cleanUserRender() {
  cleanUsers()
  userShowed = 6
}

function showAllUsers() {
  toggleElements(showMoreBtn, true)
  checkShowUsers.dataset.users = 'all'
}

function hiddenAllUsers() {
  userShowed = 6
  checkShowUsers.dataset.users = 'default'
}

function showPagination() {
  toggleElements(pagination, false)
}

function showPaginationBtns() {
  const pagintationBtns = document.querySelectorAll('.js-pagination-btn')

  pagintationBtns.forEach(btn => {
    toggleElements(btn, false)
  })
}

function hiddenPaginationBtns() {
  const pagintationBtns = document.querySelectorAll('.js-pagination-btn')

  pagintationBtns.forEach(btn => {
    toggleElements(btn, true)
  })
}

function hiddenPagination() {
  toggleElements(pagination, true)
}

