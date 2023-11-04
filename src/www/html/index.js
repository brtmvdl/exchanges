import { HTML, nLink } from '@brtmvdl/frontend'
import { TopBar } from './components/topbar.js'

export class Page extends HTML {
  onCreate() {
    this.append(new TopBar())
    this.append(this.getLink('Add funds', '/funds/add.html'))
    this.append(this.getLink('History', '/history.html'))
  }

  getLink(text, href) {
    const link = new nLink()
    link.setText(text)
    link.href(href)
    return link
  }
}
