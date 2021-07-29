const path = require('path')

// noinspection WebpackConfigHighlighting
module.exports = {
  entry: path.resolve(__dirname, 'dist/index.js'),
  output: {
    path: path.resolve(__dirname, 'dist/lib'),
    filename: 'kinnara.js',
    libraryExport: 'default',
    library: 'kinnara',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['.js', '.ts', '.json']
  },
  // 生成 SourceMap
  devtool: 'source-map',
  mode: 'production',
  module: {
    rules: [{
      test: /\.ts$/,
      use: 'ts-loader'
    }]
  }
}
