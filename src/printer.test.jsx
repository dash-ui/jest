import {createStyles} from '@dash-ui/styles'
import prettyFormat from 'pretty-format'
import React from 'react'
import ReactDOM from 'react-dom'
import serializer, {createSerializer} from 'index'
import {createStyle, renderJson} from 'test-utils'

expect.addSnapshotSerializer(serializer)
afterEach(() => {
  document.getElementsByTagName('html')[0].innerHTML = ''
})

let dashPlugin = createSerializer()

const {ReactElement, ReactTestComponent, DOMElement} = prettyFormat.plugins

describe('@dash-ui/jest with dom elements', () => {
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

describe('@dash-ui/jest with DOM elements disabled', () => {
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

it('does not replace class names that are not from dash-ui', () => {
  const style = createStyle()
  const tree = renderJson(<div className={`${style('div')} net-42 net`} />)

  const output = prettyFormat(tree, {
    plugins: [dashPlugin, ReactElement, ReactTestComponent, DOMElement],
  })

  expect(output).toMatchSnapshot()
})

describe('@dash-ui/styles with nested selectors', () => {
  it('replaces class names and inserts styles into React test component snapshots', () => {
    const style = createStyle()
    const tree = renderJson(<div className={style('div')} />)

    const output = prettyFormat(tree, {
      plugins: [dashPlugin, ReactElement, ReactTestComponent, DOMElement],
    })

    expect(output.replace(/\s+/g, ' ')).toBe(
      `.dash-ui-0 {
        color: red;
      }
      
      <div
        className="dash-ui-0"
      />`.replace(/\s+/g, ' ')
    )
  })
})

it('prints speedy styles', () => {
  const style = createStyles({speedy: true})({div: `color: hotpink;`})
  const tree = renderJson(<div className={style('div')} />)

  expect(
    prettyFormat(tree, {
      plugins: [dashPlugin, ReactElement, ReactTestComponent, DOMElement],
    })
  ).toMatchSnapshot()
})
