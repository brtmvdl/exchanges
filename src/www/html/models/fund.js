import { HistoryModel } from './history.js'

export class FundModel extends HistoryModel {
  name = 'fund'
  value = 0

  setValue(value = 0) {
    this.value = value
    this.setDatetime()
    return this
  }

  toJSON() {
    const { name, datetime, value } = this

    return { name, datetime, value }
  }

}
