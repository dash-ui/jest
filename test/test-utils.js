import {createStyles} from '@dash-ui/styles'
import renderer from 'react-test-renderer'
import * as Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({adapter: new Adapter()})

export const createStyle = (
  defs = {
    div: {color: 'red'},
    svg: {width: '100%'},
  }
) => {
  const myStyles = createStyles()
  return myStyles(defs)
}

export const renderJson = (children) => renderer.create(children).toJSON()
