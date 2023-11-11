import { HTML, nFlex } from '@brtmvdl/frontend'
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
    values: new HTML(),
  }

  onCreate() {
    this.updateBinancePrices()

    const container = new HTML()
    container.setStyle('margin', '0 auto')
    container.setStyle('width', '40rem')
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

    this.state.values.binance.map(({ symbol, price }) => {
      const value = new HTML()
      value.setStyle('margin-bottom', '1rem')

      const symbolHTML = new HTML()
      symbolHTML.setText(symbol)
      value.append(symbolHTML)

      const priceHTML = new HTML()
      priceHTML.setText(`Price: ${price2string(price, 'BRL')}`)
      value.append(priceHTML)

      const price10HTML = new HTML()
      const price10 = this.getPrice(symbol, 10)
      price10HTML.setText(`Price (10s): ${price2string(price10, 'BRL')} (${price2string(price10 - price, 'BRL')}) (${percent(price, price10)})`)
      value.append(price10HTML)

      const price30HTML = new HTML()
      const price30 = this.getPrice(symbol, 30)
      price30HTML.setText(`Price (30s): ${price2string(price30, 'BRL')} (${price2string(price30 - price, 'BRL')}) (${percent(price, price30)})`)
      value.append(price30HTML)

      const exchangeHTML = new HTML()
      const buttons = new nFlex()
      exchangeHTML.append(buttons)
      Array.from([1e2, 1e3, 1e4]).map((amount) => {
        const button = new HTML()
        button.setText(`Buy ${amount}`)
        button.on('click', () => console.log({ symbol, price, amount }))
        buttons.append(button)
      })
      value.append(exchangeHTML)

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
