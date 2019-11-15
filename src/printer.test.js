import React from 'react'
import ReactDOM from 'react-dom'
import prettyFormat from 'pretty-format'
import styles from '@-ui/styles'
import {createStyle, renderJson} from 'test-utils'
import serializer, {createSerializer} from 'index'

expect.addSnapshotSerializer(serializer)
afterEach(() => {
  document.getElementsByTagName('html')[0].innerHTML = ''
})

let dashPlugin = createSerializer()

const {ReactElement, ReactTestComponent, DOMElement} = prettyFormat.plugins

describe('@-ui/jest with dom elements', () => {
  it('replaces class names and inserts styles into React test component snapshots', () => {
    const style = createStyle()
    const tree = renderJson(
      <div className={style('div')}>
        <svg className={style('svg')} />
      </div>
    )

    const output = prettyFormat(tree, {
      plugins: [dashPlugin, ReactElement, ReactTestComponent, DOMElement],
    })

    expect(output).toMatchSnapshot()
  })

  it('replaces class names and inserts styles into DOM element snapshots', () => {
    const divRef = React.createRef()
    const style = createStyle()

    ReactDOM.render(
      <div className={style('div')} ref={divRef}>
        <svg className={style('svg')} />
      </div>,
      document.createElement('div')
    )

    const output = prettyFormat(divRef.current, {
      plugins: [dashPlugin, ReactElement, ReactTestComponent, DOMElement],
    })

    expect(output).toMatchSnapshot()
  })
})

describe('@-ui/jest with DOM elements disabled', () => {
  const dashPlugin = createSerializer({DOMElements: false})

  it('replaces class names and inserts styles into React test component snapshots', () => {
    const style = createStyle()
    const tree = renderJson(
      <div className={style('div')}>
        <svg className={style('svg')} />
      </div>
    )

    const output = prettyFormat(tree, {
      plugins: [dashPlugin, ReactElement, ReactTestComponent, DOMElement],
    })

    expect(output).toMatchSnapshot()
  })

  it('does not replace class names or insert styles into DOM element snapshots', () => {
    const divRef = React.createRef()
    const style = createStyle()

    ReactDOM.render(
      <div className={style('div')} ref={divRef}>
        <svg className={style('svg')} />
      </div>,
      document.createElement('div')
    )

    const output = prettyFormat(divRef.current, {
      plugins: [dashPlugin, ReactElement, ReactTestComponent, DOMElement],
    })

    expect(output).toMatchSnapshot()
  })
})

it('does not replace class names that are not from -ui', () => {
  const style = createStyle()
  const tree = renderJson(<div className={`${style('div')} net-42 net`} />)

  const output = prettyFormat(tree, {
    plugins: [dashPlugin, ReactElement, ReactTestComponent, DOMElement],
  })

  expect(output).toMatchSnapshot()
})

describe('@-ui/styles with nested selectors', () => {
  it('replaces class names and inserts styles into React test component snapshots', () => {
    const style = createStyle()
    const tree = renderJson(<div className={style('div')} />)

    const output = prettyFormat(tree, {
      plugins: [dashPlugin, ReactElement, ReactTestComponent, DOMElement],
    })

    expect(output.replace(/\s+/g, ' ')).toBe(
      `.-ui-0 {
        color: red;
      }
      
      <div
        className="-ui-0"
      />`.replace(/\s+/g, ' ')
    )
  })
})

it('prints speedy styles', () => {
  const style = styles.create({speedy: true})({div: `color: hotpink;`})
  const tree = renderJson(<div className={style('div')} />)

  expect(
    prettyFormat(tree, {
      plugins: [dashPlugin, ReactElement, ReactTestComponent, DOMElement],
    })
  ).toMatchSnapshot()
})
