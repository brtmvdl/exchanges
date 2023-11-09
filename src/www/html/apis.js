import * as Ajax from './ajax.js'

class Exchange {
  getAllValues() {
    return new Promise()
  }
}

class BinanceExchange extends Exchange {
  state = {
    symbols: ["USDTBRL", "LTCBTC"],
  }

  getAllValues() {
    const symbols = "[" + this.state.symbols.map((s) => '"' + s + '"').join(',') + "]"

    return Ajax.get(`https://api4.binance.com/api/v3/ticker?symbols=${symbols}`)
  }
}

export const binance = new BinanceExchange()

class FoxbitExchange extends Exchange { }

export const foxbit = new FoxbitExchange()

class BybitExchange extends Exchange { }

export const bybit = new BybitExchange()
