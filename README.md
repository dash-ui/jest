<hr>
<div align="center">
  <h1 align="center">
    @-ui/jest
  </h1>
</div>

<p align="center">
  <a aria-label="Code coverage report" href="https://codecov.io/gh/dash-ui/jest">
    <img alt="Code coverage" src="https://img.shields.io/codecov/c/gh/dash-ui/jest?style=for-the-badge&labelColor=24292e">
  </a>
  <a aria-label="Build status" href="https://travis-ci.org/dash-ui/jest">
    <img alt="Build status" src="https://img.shields.io/travis/dash-ui/jest?style=for-the-badge&labelColor=24292e">
  </a>
  <a aria-label="NPM version" href="https://www.npmjs.com/package/@-ui/jest">
    <img alt="NPM Version" src="https://img.shields.io/npm/v/@-ui/jest?style=for-the-badge&labelColor=24292e">
  </a>
  <a aria-label="License" href="https://jaredlunde.mit-license.org/">
    <img alt="MIT License" src="https://img.shields.io/npm/l/@-ui/jest?style=for-the-badge&labelColor=24292e">
  </a>
</p>

<pre align="center">npm i -D @-ui/jest</pre>
<hr>

Jest utilities for [`-ui`](https://github.com/dash-ui/styles)

## -ui snapshots

The easiest way to test React, Preact, and Preact X components with `-ui` is using the snapshot serializer. You can register the serializer via the `snapshotSerializers` configuration property in your jest configuration like so:

```js
// jest.config.js
module.exports = {
  // ... other config
  snapshotSerializers: ['@-ui/jest'],
}
```

Or you can customize the serializer via the `createSerializer` method like so: (the example below is with react-test-renderer but `@-ui/jest` also works with enzyme and react-testing-library)

```jsx harmony
import React from 'react'
import renderer from 'react-test-renderer'
import styles from '@-ui/styles'
import serializer from '@-ui/jest'

expect.addSnapshotSerializer(serializer)

test('renders with correct styles', () => {
  const text = styles({
    heading: `
      font-size: 4rem;
    `,
  })

  const tree = renderer
    .create(<h1 className={text('heading')}>Hello world</h1>)
    .toJSON()

  expect(tree).toMatchSnapshot()
})
```

### Options

#### `classNameReplacer`

`@-ui/jest`'s snapshot serializer replaces the hashes in class names with an index so that things like whitespace changes won't break snapshots. It optionally accepts a custom class name replacer, it defaults to the below.

```jsx harmony
const classNameReplacer = (className, index) => `-ui-${index}`
```

```jsx harmony
import {createSerializer} from '@-ui/jest'

expect.addSnapshotSerializer(
  createSerializer({
    classNameReplacer(className, index) {
      return `my-new-class-name-${index}`
    },
  })
)
```

#### `DOMElements`

`@-ui/jest`'s snapshot serializer inserts styles and replaces class names in both React and DOM elements. If you would like to disable this behavior for DOM elements, you can do so by passing `{ DOMElements: false }`. For example:

```jsx
import {createSerializer} from '@-ui/jest'

// configures @-ui/jest to ignore DOM elements
expect.addSnapshotSerializer(createSerializer({DOMElements: false}))
```

## Custom assertions

### toHaveStyleRule

To make more explicit assertions when testing your components you can use the `toHaveStyleRule` matcher.

```jsx harmony
import React from 'react'
import renderer from 'react-test-renderer'
import {matchers} from '@-ui/jest'

// Add the custom matchers provided by '@-ui/jest'
expect.extend(matchers)

test('renders with correct styles', () => {
  const text = styles({
    heading: `
      font-size: 4rem;
    `,
  })

  const tree = renderer
    .create(<h1 className={text('heading')}>Hello world</h1>)
    .toJSON()

  expect(tree).toHaveStyleRule('font-size', '4rem')
  expect(tree).not.toHaveStyleRule('color', 'hotpink')
})
```

## Credit

This was inspired by and relies almost entirely on work by [jest-emotion](https://github.com/emotion-js/emotion/tree/master/packages/jest-emotion)
which was largely inspired by [jest-glamor-react](https://github.com/kentcdodds/jest-glamor-react).

## LICENSE

MIT
