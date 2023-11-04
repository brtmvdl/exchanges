import { HTML } from '@brtmvdl/frontend'
import * as COLORS from './colors.js'

export class Page extends HTML {
  children = {
    input: new HTML(),
  }

  onCreate() {
    this.setStyles()
    this.append(this.getInput())
  }

  setStyles() {
    this.setStyle('background-color', COLORS.BLACK_1)
  }

  getInput() {
    this.children.input.setStyle('margin-bottom', '1rem')
    this.children.input.setStyle('color', COLORS.WHITE_1)
    this.children.input.setStyle('text-align', 'center')
    this.children.input.setStyle('padding', '1rem')
    this.children.input.setText('Exchanges')

    return this.children.input
  }
}
