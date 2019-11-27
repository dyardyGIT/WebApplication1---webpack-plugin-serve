const { resolve } = require('path');

const webpack = require('webpack');
const { WebpackPluginServe: Serve } = require('webpack-plugin-serve');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

const mode = process.env.NODE_ENV;
const isDev = mode === 'development';
const outputPath = resolve(__dirname, './Scripts/bundle');

//var jsEntries = ['./scripts/app/index.js', ...(isDev ? ['webpack-plugin-serve/client'] : [])];


var jsEntries = {};
// We search for index.js files inside basePath folder and make those as entries
var appBasePath = './Scripts/app/';
var fs = require('fs');
fs.readdirSync(appBasePath).forEach(function (name) {
    var indexFile = appBasePath + name + '/index.js'
    if (fs.existsSync(indexFile)) {
        //jsEntries[name] = indexFile
        jsEntries[name] = [indexFile, 'webpack-plugin-serve/client']
    }
})
//jsEntries = {
//    changeorder: ['./scripts/app/changeorder/index.js', 'webpack-plugin-serve/client'],
//    changeorderdetails: ['./scripts/app/changeorderdetails/index.js', 'webpack-plugin-serve/client']
//}


console.log('--jsEntries--');
var propValue;
for (var propName in jsEntries) {
    propValue = jsEntries[propName]
    console.log(propName, propValue);
}

module.exports = {
  //entry: ['./scripts/app/index.js', ...(isDev ? ['webpack-plugin-serve/client'] : [])],
  entry: jsEntries,
  mode,
  devtool: 'cheap-eval-source-map',
  module: {
    rules: [
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        loader: 'vue-loader'
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader?cacheDirectory'
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader']
      },
      {
        test: /\.woff(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            name: 'fonts/[name].[ext]',
            mimetype: 'application/font-woff'
          }
        }
      },
      {
        test: /\.woff2(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            name: 'fonts/[name].[ext]',
            mimetype: 'application/font-woff2'
          }
        }
      },
      {
        test: /\.(otf)(\?.*)?$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'fonts/[name].[ext]'
          }
        }
      },
      {
        test: /\.ttf(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            name: 'fonts/[name].[ext]',
            mimetype: 'application/octet-stream'
          }
        }
      },
      {
        test: /\.svg(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            name: 'images/[name].[ext]',
            mimetype: 'image/svg+xml'
          }
        }
      },
      {
        test: /\.(png|jpg)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            name: 'images/[name].[ext]'
          }
        }
      }
    ]
  },
  output: {
    path: outputPath,
    //publicPath: '/',
    publicPath: '/WebApplication1/Scripts/bundle/',
    //filename: 'bundle.js'
    filename: '[name].js'
  },
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js'
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    }),
    ...(isDev
      ? [
          //new Serve({
          //  // note: this value is true by default
          //  hmr: true,
          //  historyFallback: true,
          //  static: [outputPath]
          //})
          new Serve({
            host: "localhost",
            progress: "minimal",
            port: 8080,
          })
        ]
      : [])
  ],
  watch: isDev
};
