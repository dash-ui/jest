// eslint-disable-next-line
import * as enzyme from 'enzyme'
import React from 'react'
import {matchers} from 'index'
import {createStyle, renderJson} from 'test-utils'

const {toHaveStyleRule} = matchers
expect.extend(matchers)
afterEach(() => {
  document.getElementsByTagName('html')[0].innerHTML = ''
})

describe('toHaveStyleRule', () => {
  const enzymeMethods = ['mount', 'render']

  it('matches styles on the top-most node passed in', () => {
    const style = createStyle()
    const tree = renderJson(
      <div className={style('div')}>
        <svg className={style('svg')} />
      </div>
    )

    expect(tree).toHaveStyleRule('color', 'red')
    expect(tree).not.toHaveStyleRule('width', '100%')

    const svgNode = tree.children[0]

    expect(svgNode).toHaveStyleRule('width', '100%')
    expect(svgNode).not.toHaveStyleRule('color', 'red')
  })

  it('supports asymmetric matchers', () => {
    const style = createStyle()
    const tree = renderJson(
      <div className={style('div')}>
        <svg className={style('svg')} />
      </div>
    )

    expect(tree).toHaveStyleRule('color', expect.anything())
    expect(tree).not.toHaveStyleRule('padding', expect.anything())

    const svgNode = tree.children[0]

    expect(svgNode).toHaveStyleRule('width', expect.stringMatching(/.*%$/))
  })

  it('supports enzyme render methods', () => {
    const style = createStyle()
    // eslint-disable-next-line
    const Component = (props) => (
      <div className={style('div')}>
        <svg className={style('svg')} />
      </div>
    )

    enzymeMethods.forEach((method) => {
      const wrapper = enzyme[method](<Component />)
      expect(wrapper).toHaveStyleRule('color', 'red')
      expect(wrapper).not.toHaveStyleRule('width', '100%')
      const svgNode = wrapper.find('svg')
      expect(svgNode).toHaveStyleRule('width', '100%')
      expect(svgNode).not.toHaveStyleRule('color', 'red')
    })
  })

  it('fails if no styles are found', () => {
    const tree = renderJson(<div />)
    const result = toHaveStyleRule(tree, 'color', 'red')
    expect(result.pass).toBe(false)
    expect(result.message()).toBe('Property not found: color')
  })

  it('supports regex values', () => {
    const style = createStyle()
    const tree = renderJson(<div className={style('div')} />)
    expect(tree).toHaveStyleRule('color', /red/)
  })

  it('matches styles on the focus, hover targets', () => {
    const style = createStyle({
      div: `
        color: white;
        &:hover {
          color: yellow;
        }
        &:focus {
          color: black;
        }
      `,
    })

    const tree = renderJson(<div className={style('div')} />)
    expect(tree).toHaveStyleRule('color', 'yellow', {target: ':hover'})
    expect(tree).toHaveStyleRule('color', 'black', {target: ':focus'})
    expect(tree).toHaveStyleRule('color', 'white')
  })

  it('matches target styles by regex', () => {
    const style = createStyle({
      div: `
        a {
          color: yellow;
          
          &:hover {
            color: black;
          }
        }
      `,
    })

    const tree = renderJson(<div className={style('div')} />)
    expect(tree).toHaveStyleRule('color', 'yellow', {target: /a$/})
  })

  it('matches proper style for css', () => {
    const style = createStyle({
      div: `
        color: green;
        color: hotpink;
      `,
    })

    const tree = renderJson(<div className={style('div')} />)
    expect(tree).not.toHaveStyleRule('color', 'green')
    expect(tree).toHaveStyleRule('color', 'hotpink')
  })

  it('matches styles with target and media options', () => {
    const style = createStyle({
      div: `
        color: white;
        @media (min-width: 420px) {
          color: green;
          &:hover {
            color: yellow;
          }
        }
      `,
    })

    const tree = renderJson(
      <div className={style('div')}>
        <span>Test</span>
      </div>
    )

    expect(tree).toHaveStyleRule('color', 'yellow', {
      target: ':hover',
      media: '(min-width: 420px)',
    })
    expect(tree).toHaveStyleRule('color', 'green', {
      media: '(min-width: 420px)',
    })
    expect(tree).toHaveStyleRule('color', 'white')
  })

  it('matches styles with target and supports options', () => {
    const style = createStyle({
      div: `
        color: white;
        @supports (min-width: 420px) {
          color: green;
          &:hover {
            color: yellow;
          }
        }
      `,
    })

    const tree = renderJson(
      <div className={style('div')}>
        <span>Test</span>
      </div>
    )

    expect(tree).toHaveStyleRule('color', 'yellow', {
      target: ':hover',
      supports: '(min-width: 420px)',
    })
    expect(tree).toHaveStyleRule('color', 'green', {
      supports: '(min-width: 420px)',
    })
    expect(tree).toHaveStyleRule('color', 'white')
  })

  it('matches styles with target and supports and media options', () => {
    const style = createStyle({
      div: `
        color: white;
        @media (min-width: 420em) {
          @supports (min-width: 420px) {
            color: green;
            &:hover {
              color: yellow;
            }
          }
        }
      `,
    })

    const tree = renderJson(
      <div className={style('div')}>
        <span>Test</span>
      </div>
    )

    expect(tree).toHaveStyleRule('color', 'yellow', {
      target: ':hover',
      supports: '(min-width: 420px)',
      media: '(min-width: 420em)',
    })
    expect(tree).toHaveStyleRule('color', 'green', {
      supports: '(min-width: 420px)',
      media: '(min-width: 420em)',
    })
    expect(tree).toHaveStyleRule('color', 'white')
  })
})
