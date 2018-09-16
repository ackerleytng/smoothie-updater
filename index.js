let id = null

const fit = function (el) {
  const container = el.parent()
  const scale = Math.min(
    container.width() / el.outerWidth(),    
    container.height() / el.outerHeight()
  )

  el.css({
    transform: `scale(${scale})`,
  })

  container.height(el.outerHeight() * scale)
}

function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

const getCollection = function (collectionName, apikey) {
  const params = {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'content-type': 'application/json',
      'x-apikey': apikey
    }
  }
  return fetch(`https://smoothie-e5e2.restdb.io/rest/${collectionName}`, params)
}

const putData = function (collectionName, apikey) {
  const params = {
    method: 'PUT',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'content-type': 'application/json',
      'x-apikey': apikey
    },
    body: JSON.stringify({
      grabber: $('#grabber').html(),
      snarky: $('#snarky').html()
    })
  }
  return fetch(`https://smoothie-e5e2.restdb.io/rest/${collectionName}/${id}`, params)
}

const alertError = function (errorText, statusText) {
  $('#error-alert-text').html(errorText)

  $('#error-alert')
    .removeClass('collapse')
    .addClass('show')

  $('#button-spinner')
    .remove()
}

const alertSuccess = function (successText) {
  $('#success-alert-text').html(successText)

  $('#success-alert')
    .fadeIn()
    .delay(2000)
    .fadeOut()

  $('#button-spinner')
    .remove()
}

const getLast = function (data) {
  return data[data.length - 1]
}

const applyData = function (data) {
  id = data._id
  $('#grabber').html(data.grabber)
  $('#snarky').html(data.snarky)

  return data
}

const addSpinner = function () {
  $('#the-button').append(' <i id="button-spinner" class="fas fa-spinner fa-spin"></i>')
}

const removeSpinner = function () {
  $('#button-spinner').remove()
}

const apply = function () {
  addSpinner()

  putData($('#username').val(), $('#password').val())
    .then(handleErrors)
    .then(removeSpinner)
    .then(() => alertSuccess('Done. Check your smoothie!'))
    .catch((err) => alertError('Couldn\'t talk to server', err))
}

const doAfterConnect = function (pass) {
  $('#sign-in-controls')
    .slideUp()

  $('#the-button')
    .html('Apply to smoothie!')
    .off('click')
    .click(apply)

  $('.smoothie-editable')
    .attr('contenteditable', 'true')

  $('#grabber')
    .focus()
    .html($('#grabber').html())

  return pass
}

const signIn = function () {
  const collectionName = $('#username').val()
  const apikey = $('#password').val()

  addSpinner()

  getCollection(collectionName, apikey)
    .then(handleErrors)
    .then(d => d.json())
    .then(getLast)
    .then(applyData)
    .then(doAfterConnect)
    .catch((err) => alertError('Check your username/password?', err))
}

const main = function () {
  fit($('#smoothie-display'))

  $('#the-button').click(signIn)
}

$(main)
