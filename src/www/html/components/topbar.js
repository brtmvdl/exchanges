import { HTML, nFlex } from '@brtmvdl/frontend'
import * as COLORS from '../colors.js'

export class TopBar extends HTML {
  children = {
    title: new HTML(),
  }

  state = {
    title: '',
  }

  constructor({ title = 'Exchanges' } = {}) {
    super()

    this.state.title = title
  }

  onCreate() {
    this.setContainerStyle('margin-bottom', '1rem')

    this.setStyle('background-color', COLORS.BLACK_1)
    this.append(this.getFlex())
  }

  getFlex() {
    const flex = new nFlex()
    flex.append(this.getMenuButton())
    flex.append(this.getTitle())
    flex.append(this.getSearchButton())
    return flex
  }

  getMenuButton() {
    return new HTML()
  }

  getTitle() {
    this.children.title.setStyle('color', COLORS.WHITE_1)
    this.children.title.setStyle('text-align', 'center')
    this.children.title.setStyle('padding', '1rem')

    this.children.title.setText(this.state.title)

    return this.children.title
  }

  getSearchButton() {
    return new HTML()
  }
}
