const { getDefaultConfig } = require('@expo/metro-config')
const path = require('path')

const config = getDefaultConfig(__dirname)

const { transformer, resolver } = config
config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve('react-native-svg-transformer')
}

const workspaceRoot = path.resolve(__dirname, '..')
const projectRoot = __dirname

config.watchFolders = [workspaceRoot]

config.resolver.nodeModulesPaths = [path.resolve(projectRoot, 'node_modules'), path.resolve(workspaceRoot, 'node_modules')]

config.resolver.sourceExts.push('cjs')
config.resolver = {
    ...resolver,
    assetExts: [resolver.assetExts.filter((ext) => ext !== 'svg'), 'txt', 'xml', 'png', 'jpg', 'pb', 'tflite', 'ttf'],
    sourceExts: [...resolver.sourceExts, 'svg', 'txt', 'xml', 'png', 'jpg', 'pb', 'tflite', 'ttf']
}
module.exports = config
