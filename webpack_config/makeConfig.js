'use strict';
const path = require('path');
const webpack = require('webpack');
const threadLoader = require('thread-loader');
const hasher = require('folder-hash');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const AutoDllPlugin = require('autodll-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const BabelMinifyPlugin = require('babel-minify-webpack-plugin');
const SriPlugin = require('webpack-subresource-integrity');
const ClearDistPlugin = require('./plugins/clearDist');
const SortCachePlugin = require('./plugins/sortCache');

const config = require('./config');

const DEFAULT_OPTIONS = {
  isProduction: false,
  isElectronBuild: false,
  isHTMLBuild: false,
  outputDir: ''
};

module.exports = function(opts = {}) {
  const options = Object.assign({}, DEFAULT_OPTIONS, opts);
  const isDownloadable = options.isHTMLBuild || options.isElectronBuild;

  return hasher.hashElement(__dirname + '/../common').then(function(clientHashObj) {
    const client = clientHashObj.hash.replace(/[^A-Za-z0-9]/g, '');
    console.log('clientHash', client);
    x;
    return hasher.hashElement(__dirname + '/../node_modules').then(function(vendorHashObj) {
      const vendor = vendorHashObj.hash.replace(/[^A-Za-z0-9]/g, '');
      console.log('vendorHash', vendor);

      return hasher.hashElement(__dirname + '/../common/sass').then(function(cssHashObj) {
        const css = cssHashObj.hash.replace(/[^A-Za-z0-9]/g, '');
        console.log('cssHash', css);

        // ====================
        // ====== Entry =======
        // ====================
        const entry = {
          client: './common/index.tsx'
        };

        if (options.isProduction) {
          entry.vendor = config.vendorModules;
        }

        // ====================
        // ====== Rules =======
        // ====================
        const rules = [];

        // Typescript
        if (options.isProduction || !process.env.SLOW_BUILD_SPEED) {
          rules.push(config.typescriptRule);
        } else {
          threadLoader.warmup(config.typescriptRule.use[0].options, [
            config.typescriptRule.use[0].loader
          ]);
          rules.push({
            ...config.typescriptRule,
            use: [
              {
                loader: 'thread-loader',
                options: {
                  workers: 4
                }
              },
              ...config.typescriptRule.use
            ]
          });
        }

        // Styles (CSS, SCSS)
        if (options.isProduction) {
          rules.push(
            {
              test: /\.css$/,
              use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: 'css-loader'
              })
            },
            {
              test: /\.scss$/,
              use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: ['css-loader', 'sass-loader']
              })
            }
          );
        } else {
          rules.push(
            {
              test: /\.css$/,
              include: path.resolve(config.path.src, 'vendor'),
              use: ['style-loader', 'css-loader']
            },
            {
              test: /\.scss$/,
              include: ['components', 'containers', 'sass']
                .map(dir => path.resolve(config.path.src, dir))
                .concat([config.path.modules]),

              use: ['style-loader', 'css-loader', 'sass-loader']
            }
          );
        }

        // Web workers
        rules.push({
          test: /\.worker\.js$/,
          loader: 'worker-loader'
        });

        // Images
        rules.push({
          include: [path.resolve(config.path.assets), path.resolve(config.path.modules)],
          test: /\.(gif|png|jpe?g|svg)$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                hash: 'sha512',
                digest: 'hex',
                name: '[path][name].[ext]?[hash:6]'
              }
            },
            {
              loader: 'image-webpack-loader',
              options: {
                bypassOnDebug: true,
                optipng: {
                  optimizationLevel: 4
                },
                gifsicle: {
                  interlaced: false
                },
                mozjpeg: {
                  quality: 80
                },
                svgo: {
                  plugins: [
                    { removeViewBox: true },
                    { removeEmptyAttrs: false },
                    { sortAttrs: true }
                  ]
                }
              }
            }
          ]
        });

        // Fonts
        rules.push({
          include: [path.resolve(config.path.assets), path.resolve(config.path.modules)],
          test: /\.(ico|eot|otf|webp|ttf|woff|woff2)(\?.*)?$/,
          loader: 'file-loader'
        });

        // ====================
        // ====== Plugins =====
        // ====================
        const plugins = [
          new HtmlWebpackPlugin({
            title: config.title,
            template: path.resolve(config.path.src, 'index.html'),
            inject: true
          }),

          new CopyWebpackPlugin([
            {
              from: config.path.static,
              // to the root of dist path
              to: './'
            }
          ]),

          new webpack.LoaderOptionsPlugin({
            minimize: options.isProduction,
            debug: !options.isProduction,
            options: {
              // css-loader relies on context
              context: process.cwd()
            }
          }),

          new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(
              options.isProduction ? 'production' : 'development'
            ),
            'process.env.BUILD_DOWNLOADABLE': JSON.stringify(isDownloadable),
            'process.env.BUILD_HTML': JSON.stringify(options.isHTMLBuild),
            'process.env.BUILD_ELECTRON': JSON.stringify(options.isElectronBuild)
          })
        ];

        if (options.isProduction) {
          plugins.push(
            new BabelMinifyPlugin(
              {
                // Mangle seems to be reusing variable identifiers, causing errors
                mangle: false,
                // These two on top of a lodash file are causing illegal characters for
                // safari and ios browsers
                evaluate: false,
                propertyLiterals: false
              },
              {
                comments: false
              }
            ),
            new webpack.optimize.CommonsChunkPlugin({
              name: 'vendor',
              filename: `vendor.${vendor}.js`
            }),
            new ExtractTextPlugin(`[name].${css}.css`),
            new FaviconsWebpackPlugin({
              logo: path.resolve(config.path.assets, 'images/favicon.png'),
              background: '#163151',
              inject: true
            }),
            new SriPlugin({
              hashFuncNames: ['sha256', 'sha384'],
              enabled: true
            }),
            new ProgressPlugin(),
            new ClearDistPlugin(),
            new SortCachePlugin()
          );
        } else {
          plugins.push(
            new AutoDllPlugin({
              inject: true, // will inject the DLL bundles to index.html
              filename: '[name]_[hash].js',
              debug: true,
              context: path.join(config.path.root),
              entry: {
                vendor: [
                  ...config.vendorModules,
                  'babel-polyfill',
                  'bootstrap-sass',
                  'font-awesome'
                ]
              }
            }),
            new HardSourceWebpackPlugin({
              environmentHash: {
                root: process.cwd(),
                directories: ['webpack_config'],
                files: ['package.json']
              }
            }),
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoEmitOnErrorsPlugin(),
            new FriendlyErrorsPlugin()
          );
        }

        if (options.isElectronBuild) {
          // target: 'electron-renderer' kills scrypt, so manually pull in some
          // of its configuration instead
          plugins.push(
            new webpack.ExternalsPlugin('commonjs', [
              'desktop-capturer',
              'electron',
              'ipc',
              'ipc-renderer',
              'remote',
              'web-frame',
              'clipboard',
              'crash-reporter',
              'native-image',
              'screen',
              'shell'
            ])
          );
        }

        // ====================
        // ====== DevTool =====
        // ====================
        let devtool = false;
        if (!options.isProduction) {
          if (process.env.VSCODE_DEBUG) {
            devtool = 'cheap-module-source-map';
          } else {
            devtool = 'cheap-module-eval-source-map';
          }
        }

        // ====================
        // ====== Output ======
        // ====================
        const output = {
          path: path.resolve(config.path.output, options.outputDir),
          filename: options.isProduction ? `[name].${client}.js` : '[name].js',
          publicPath: isDownloadable && options.isProduction ? './' : '/',
          crossOriginLoading: 'anonymous'
        };

        // The final bundle
        return {
          devtool,
          entry,
          output,
          module: { rules },
          plugins,
          target: 'web',
          resolve: config.resolve,
          performance: {
            hints: options.isProduction ? 'warning' : false
          },
          stats: {
            // Reduce build output
            children: false,
            chunks: false,
            chunkModules: false,
            chunkOrigins: false,
            modules: false
          }
        };
      });
    });
  });
};
