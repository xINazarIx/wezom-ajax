const parent = document.querySelector('.js-users')
const btn = document.querySelector('.js-btn')
const preloader = document.querySelector('.js-preloader')
const template = document.querySelector('#js-user')


btn.addEventListener('click', () => {
  const promise = getUsers(randomInteger(1, 100)) // Делаем запрос на сервер || Получаем промис
  promise.then(response => response.json()).then(data => createUsers(data))

  switchPreloader(true)
  btn.classList.add('btn--hidden')
})

function createUsers(data) {
  let frag = document.createDocumentFragment()

  data.results.forEach(elem => {
    switchPreloader(false)

    let user = template.content.cloneNode(true)

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

    frag.appendChild(user)
  })

  parent.appendChild(frag)
}


function switchPreloader(flag){
  flag == true ? preloader.classList.remove('preloader--hidden') : preloader.classList.add('preloader--hidden')
}

function createStatistic(){
  const statistic = document.querySelector('.js-statistic')
  statistic.classList.remove('statistic--hidden')
}

// const state = {
//   show(elem){
//     return elem.classList.remove('hidden')
//   },
//   hide(elem){
//     return elem.classList.add('hidden')
//   }
// }

