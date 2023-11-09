
const parseSuccess = (xhr) => JSON.parse(xhr.responseText)

export const request = (method = 'GET', url = '', headers = new Headers(), data = {}) => {
  return new Promise((s, f) => {
    const xhr = new XMLHttpRequest()
    xhr.open(method, url, true)
    Array.from(headers).map(([key, value]) => xhr.setRequestHeader(key, value))

    const onComplete = () => xhr.status === 200 ? s(parseSuccess(xhr)) : f(parseError(xhr))

    xhr.onload = () => onComplete()
    xhr.onerror = () => onComplete()

    xhr.send(JSON.stringify(data))
  })
}

export const get = (url) => request('GET', url)

export const post = (url) => request('POST', url)
