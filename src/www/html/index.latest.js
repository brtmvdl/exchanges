import { HTML, nFlex, nImage } from '@brtmvdl/frontend'
import { TopBar } from './components/topbar.js'
import { KeyValuePair } from './utils/classes.js'
import * as APIS from './apis.js'

export class Page extends HTML {
  children = {
    exchanges_list: new HTML(),
    coins_table: new HTML(),
  }

  state = {
    pairValues: [],
    exchange: 'binance',
    exchanges: [
      new KeyValuePair('binance', 'Binance'),
      new KeyValuePair('foxbit', 'Foxbit'),
      new KeyValuePair('bybit', 'Bybit'),
    ],
  }

  onCreate() {
    this.append(new TopBar())
    const container = new HTML()
    container.setStyle('margin', '0 auto')
    container.setStyle('width', '40rem')
    container.append(this.getExchangesList())
    container.append(this.getCoinsTable())
    this.append(container)
    //
    this.updateValues()
  }

  updateValues() {
    APIS[this.state.exchange]?.getAllValues()
      .then((res) => this.state.pairValues = res)
      .then(() => console.log(this.state.pairValues))
      .then(() => setTimeout(this.updateValues(), 500))
  }

  getExchangesList() {
    const flex = new nFlex()

    this.state.exchanges.map(({ key, value }) => {
      const exchange = new HTML()
      exchange.on('click', () => { this.state.exchange = key })

      const image = new nImage()
      image.src(`/img/${key}.png`)
      image.setStyle('max-width', '200px')
      exchange.append(image)

      const text = new HTML()
      text.setText(value)
      text.setStyle('text-align', 'center')
      exchange.append(text)

      flex.append(exchange)
    })

    this.children.exchanges_list.append(flex)

    return this.children.exchanges_list
  }

  getCoinsTable() {
    return this.children.coins_table
  }
}
