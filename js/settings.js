import { createRow, getEditedData } from "./main.js";


const apiUrl = `http://localhost:3000/users`


// POST - új adat létrehozása
function createUser(newData) {
  let data = newData
  let fetchOptions = {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };

  fetch(`http://localhost:3000/users`, fetchOptions).then(
    resp => resp.json(),
    err => console.error(err)
  ).then(
    createRow(newData, 'afterbegin')
  )
}

// PUT - adat átírása
function saveNewData() {
  let data = getEditedData();
  let fetchOptions = {
    method: "PUT",
    mode: "cors",
    cache: "no-cache",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };
  fetch(`http://localhost:3000/users/${data.id}`, fetchOptions).then(
    resp => resp.json(),
    err => console.error(err)
  );
  return data
}

export {
  apiUrl,
  saveNewData,
  createUser
}