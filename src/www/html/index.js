import { HTML, nTable, nTr, nTd } from '@brtmvdl/frontend'
import * as Local from './utils/local.js'
import { price2string } from './utils/str.js'
import { percent } from './utils/math.js'

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

    const symbolHTML = new nTd()
    symbolHTML.setStyle('width', '12.5%')
    symbolHTML.setText('symbol')
    value.append(symbolHTML)

    const priceHTML = new nTd()
    priceHTML.setStyle('width', '12.5%')
    priceHTML.setText('price')
    value.append(priceHTML)

    const price10HTML = new nTd()
    price10HTML.setStyle('width', '25%')
    price10HTML.setText('10s')
    value.append(price10HTML)

    const price30HTML = new nTd()
    price30HTML.setStyle('width', '25%')
    price30HTML.setText('30s')
    value.append(price30HTML)

    const price60HTML = new nTd()
    price60HTML.setStyle('width', '25%')
    price60HTML.setText('60s')
    value.append(price60HTML)

    this.children.values.append(value)

    this.state.values.binance.map(({ symbol, price }) => {
      const value = new nTr()
      value.setStyle('margin-bottom', '1rem')

      const symbolHTML = new nTd()
      symbolHTML.setText(symbol)
      value.append(symbolHTML)

      const priceHTML = new nTd()
      priceHTML.setText(`${price2string(price)}`)
      value.append(priceHTML)

      const price10HTML = new nTd()
      const price10 = this.getPrice(symbol, 10)
      price10HTML.setText(`${price2string(price10)} (${price2string(price - price10)}) (${percent(price, price10)})`)
      value.append(price10HTML)

      const price30HTML = new nTd()
      const price30 = this.getPrice(symbol, 30)
      price30HTML.setText(`${price2string(price30)} (${price2string(price - price30)}) (${percent(price, price30)})`)
      value.append(price30HTML)

      const price60HTML = new nTd()
      const price60 = this.getPrice(symbol, 60)
      price60HTML.setText(`${price2string(price60)} (${price2string(price - price60)}) (${percent(price, price60)})`)
      value.append(price60HTML)

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
