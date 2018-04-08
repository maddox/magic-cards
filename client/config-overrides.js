let {getLoader} = require('react-app-rewired')

module.exports = function override(config, env) {
  config = configurePostCss(config, env)
  return config
}

function configurePostCss(config, env) {
  let cssLoader = getLoader(config.module.rules, rule => String(rule.test).match(/\.css/))

  delete cssLoader.loader
  cssLoader.use = [
    require.resolve('style-loader'),
    {
      loader: require.resolve('css-loader'),
      options: {
        importLoaders: 1,
      },
    },
    {
      loader: require.resolve('postcss-loader'),
      options: {
        // Necessary for external CSS imports to work
        // https://github.com/facebookincubator/create-react-app/issues/2677
        ident: 'postcss',
        plugins: () => [require('postcss-nested'), require('autoprefixer')],
      },
    },
  ]

  return config
}
