

export const padLeft = (text = '', length = 1, pad = ' ') => {
  while (text.toString().length < length) {
    text = pad.toString() + text.toString()
  }

  return text.toString()
}

export const price2string = (price = 0) => {
  const [bills, cents] = price.toString().split('.')

  return `${bills},${padLeft(cents, 2, '0')}`
}
