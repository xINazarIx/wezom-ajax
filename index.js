let template = document.querySelector('#js-user')
let parent = document.querySelector('.users')
let btn = document.querySelector('.js-btn')
let preloader = document.querySelector('.js-preloader')

btn.addEventListener('click', () => {
  preloader.classList.remove('preloader--hide')
  getUsers(randomInteger(1, 100), onDataReceived) // Делаем запрос на сервер 
  btn.remove()
})

function randomInteger(min, max) {
  return Math.round(min - 0.5 + Math.random() * (max - min + 1));
}

function onDataReceived(data) {
  preloader.remove()
  
  data.results.forEach(elem => {
    template.content.querySelector('.js-user-card__img').src = elem.picture.large
    template.content.querySelector('.js-user-card__name').textContent = ''

    for (let key in elem.name) {
      template.content.querySelector('.js-user-card__name').textContent += ' ' + elem.name[key]
    }

    template.content.querySelector('.js-user-card__gender').textContent = elem.gender
    template.content.querySelector('.js-user-card__gender').dataset.gender = elem.gender

    template.content.querySelector('.js-user-card__number').textContent = elem.phone
    template.content.querySelector('.js-user-card__number').href = 'tel:' + elem.phone

    template.content.querySelector('.js-user-card__email').textContent = elem.email
    template.content.querySelector('.js-user-card__email').href = 'mailto:' + elem.email

    template.content.querySelector('.js-user-card__location div').textContent = `${elem.location.city}, ${elem.location.street.name},`

    template.content.querySelector('.js-user-card__location span').textContent = elem.location.street.number

    let birthday = new Date(elem.dob.date)
    template.content.querySelector('.js-user-card__birthday span').textContent = `${birthday.getDate()}-${birthday.getMonth()}-${birthday.getFullYear()}`

    let reg = new Date(elem.registered.date)
    template.content.querySelector('.js-user-card__reg span').textContent = `${reg.getDate()}-${reg.getMonth()}-${reg.getFullYear()}`


    let user = template.content.cloneNode(true)
    parent.appendChild(user)
  })
}

