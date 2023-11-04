import { HTML, nInput, nButton } from '@brtmvdl/frontend'
import { TopBar } from './components/topbar.js'
import { FundModel } from './models/fund.js'
import * as Local from './utils/local.js'

export class Page extends HTML {
  children = {
    input: new nInput(),
    button: new nButton(),
  }

  onCreate() {
    this.append(new TopBar())
    this.append(this.getForm())
  }

  getForm() {
    const form = new HTML()
    form.append(this.getInput())
    form.append(this.getButton())
    return form
  }

  getInput() {
    this.children.input.setAttr('type', 'number')

    return this.children.input
  }

  getButton() {
    this.children.button.setText('add funds')
    this.children.button.on('click', () => {
      const fund = new FundModel()
      fund.setValue(+this.children.input.getValue())
      Local.add(['history'], fund)
    })

    return this.children.button
  }
}
