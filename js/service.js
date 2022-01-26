function getUsers(users){
  return fetch(`https://randomuser.me/api/?results=${users}`)
}

let arr = [
  {
    cell: "0773-767-192",
    dob: {
      age: 39,
      date: "1983-07-31T21:32:57.020Z"
    },
    email: "donna.vargas@example.com",
    gender: "female",
    id: {
      name: "NINO",
      value: "WC 90 77 77 E",
    },
    location: {
      city: "Stoke-on-Trent",
      coordinates: {latitude: '7.5217', longitude: '153.8595'},
      country: "United Kingdom",
      postcode: "N65 9PE",
      state: "Essex",
      street: {number: 8264, name: 'Main Road'},
      timezone: {offset: '+3:30', description: 'Tehran'},
    },
    login: {
      md5: "46c0890ddbb094c767b912c67abd6bbb",
      password: "freeuser",
      salt: "3FBmQlJr",
      sha1: "916e6db30121dd621906964edd4ce0f2bc2c700f",
      sha256: "150d7540c562abb68437df9ee3fe5436b1354908f39cd9eadeff031aa3966243",
      username: "brownduck896",
      uuid: "4e69d5d5-6e87-43b2-9453-3eb0f078eb7b",
    },
    picture: {
      large: "https://randomuser.me/api/portraits/women/96.jpg",
      medium: "https://randomuser.me/api/portraits/med/women/96.jpg",
      thumbnail: "https://randomuser.me/api/portraits/thumb/women/96.jpg",
    },
    registered: {date: '2002-10-21T16:56:24.920Z', age: 20},
    name: {title: 'Mrs', first: 'Donna', last: 'Vargas'},
    phone: "016977 2795",
  }
]