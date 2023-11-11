import { HTML, nTable, nTr, nTd } from '@brtmvdl/frontend'
import * as Local from './utils/local.js'
import { price2string } from './utils/str.js'
import { percent } from './utils/math.js'

class nTd2 extends nTd {
  onCreate() {
    this.setStyle('padding-bottom', '1rem')
  }
}

const createTd2 = (text = '') => {
  const td2 = new nTd2()
  td2.setStyle('width', '10%')
  td2.setText(text)
  return td2
}

export class Page extends HTML {
  state = {
    enabled: {
      binance: [
        'BTCBRL',
        'USDTBRL',
        'ETHBRL',
        'XRPBRL',
        'BNBBRL',
        'MATICBRL',
        'SOLBRL',
        'LINKBRL',
        'LTCBRL',
        'AVAXBRL',
        'DOGEBRL',
        'ADABRL',
        'DOTBRL',
        'BUSDBRL',
        'CHZBRL'
      ],
    },
    values: {
      binance: [],
    },
    symbols: [],
  }

  children = {
    values: new nTable(),
  }

  onCreate() {
    this.updateBinancePrices()
    Local.set(['history'], [])
    const container = new HTML()
    container.append(this.getValuesTable())
    this.append(container)
  }

  getValuesTable() {
    this.children.values.setStyle('width', '100%')
    return this.children.values
  }

  updateValuesHistory() {
    const datetime = Date.now()

    this.state.values.binance.map(({ symbol, price }) => {
      Local.add(['history'], { symbol, price, datetime })
    })

    const history = Local.get(['history'])

    if (history.length > 2e3) {
      Local.set(['history'], history.filter((_, ix) => ix > 1e3))
    }
  }

  getPrice(symbol, interval = 0) {
    const now = Date.now()
    const sec = interval * 1000
    const history = Local.get(['history'], [])
      .filter(({ symbol: s }) => symbol === s)
      .filter(({ datetime }) => datetime > now - sec)
      .find(() => true)

    return history?.price || 0
  }

  updateValuesTable() {
    this.children.values.clear()

    const value = new nTr()
    value.setStyle('margin-bottom', '1rem')

    value.append(createTd2('symbol'))

    value.append(createTd2('price'))

    value.append(createTd2('price10'))
    value.append(createTd2('diff10'))
    value.append(createTd2('percent10'))

    value.append(createTd2('price30'))
    value.append(createTd2('diff30'))
    value.append(createTd2('percent30'))

    value.append(createTd2('price60'))
    value.append(createTd2('diff60'))
    value.append(createTd2('percent60'))

    this.children.values.append(value)

    this.state.values.binance.map(({ symbol, price }) => {
      const value = new nTr()
      value.setStyle('margin', '1rem')

      value.append(createTd2(symbol))

      value.append(createTd2(`${price2string(price)}`))

      const price10 = this.getPrice(symbol, 10)
      value.append(createTd2(price2string(price10)))
      value.append(createTd2(price2string(price - price10)))
      value.append(createTd2(percent(price, price10)))

      const price30 = this.getPrice(symbol, 30)
      value.append(createTd2(price2string(price30)))
      value.append(createTd2(price2string(price - price30)))
      value.append(createTd2(percent(price, price30)))

      const price60 = this.getPrice(symbol, 60)
      value.append(createTd2(price2string(price60)))
      value.append(createTd2(price2string(price - price60)))
      value.append(createTd2(percent(price, price60)))

      this.children.values.append(value)
    })
  }

  updateBinancePrices() {
    const symbols = this.state.enabled.binance.map((s) => `"${s}"`).join(',')

    fetch(`https://api2.binance.com/api/v3/ticker/price?symbols=[${symbols}]`)
      .then((res) => res.json())
      .then((values) => this.state.values.binance = values.map(({ symbol, price }) => ({ symbol, price: +price, exchange: 'binance' })))
      .then(() => this.updateValuesTable())
      .then(() => this.updateValuesHistory())
      .then(() => this.updateBinancePrices())
  }
}
