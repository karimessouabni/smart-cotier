module.exports = function(api) {
  api.cache(true);
  return {
        presets: ['babel-preset-expo', '@babel/preset-typescript'],
        sourceMaps: true,

        plugins: [ 'react-native-reanimated/plugin']
  };
};
