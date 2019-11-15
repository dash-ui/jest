/** @jsx h */
// eslint-disable-next-line
import {h} from 'preact'
import render from 'preact-render-to-json'
import prettyFormat from 'pretty-format'
import {createStyle} from 'test-utils'
import serializer, {createSerializer} from 'index'
const {ReactElement, ReactTestComponent, DOMElement} = prettyFormat.plugins

expect.addSnapshotSerializer(serializer)
let dashPlugin = createSerializer()
afterEach(() => {
  document.getElementsByTagName('html')[0].innerHTML = ''
})

describe('@-ui/jest with preact', () => {
  it('replaces class names and inserts styles into preact test component snapshots', () => {
    const style = createStyle()
    const tree = render(
      <div class={style('div')}>
        <svg class={style('svg')} />
      </div>
    )

    const output = prettyFormat(tree, {
      plugins: [dashPlugin, ReactElement, ReactTestComponent, DOMElement],
    })

    expect(output).toMatchSnapshot()
  })

  it('handles elements with no props', () => {
    const tree = render(<div />)

    const output = prettyFormat(tree, {
      plugins: [dashPlugin, ReactElement, ReactTestComponent, DOMElement],
    })

    expect(output).toMatchSnapshot()
  })
})
