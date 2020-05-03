import styles from '@dash-ui/styles'
import renderer from 'react-test-renderer'
import * as enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

enzyme.configure({adapter: new Adapter()})

export const createStyle = (
  defs = {
    div: {color: 'red'},
    svg: {width: '100%'},
  }
) => {
  const myStyles = styles.create()
  return myStyles(defs)
}

export const renderJson = (children) => renderer.create(children).toJSON()
