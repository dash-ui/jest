module.exports = (api) => {
  const esm = api.env('esm')
  const test = api.env('test')

  return {
    presets: [
      test && '@babel/react',
      [
        '@lunde/es',
        {
          env: {
            modules: esm ? false : 'commonjs',
            targets: {
              node: test ? 'current' : esm ? '12' : '10',
            },
          },
          devExpression: false,
          typescript: false,
        },
      ],
    ].filter(Boolean),
  }
}
