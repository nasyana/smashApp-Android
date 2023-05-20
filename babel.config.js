module.exports = function (api) {
  api.cache(true);
  return {
     presets: ['babel-preset-expo'],
     plugins: ['react-native-reanimated/plugin'],
     plugins: [
        [
           'module-resolver',
           {
              root: ['./src'],
              extensions: [
                 '.ios.js',
                 '.android.js',
                 '.js',
                 '.ts',
                 '.tsx',
                 '.json',
              ],
              alias: {
                 '@components': './src/components/*',
                 '@modules': './src/modules/*',
                 '@redux': './src/redux/*',
                 '@translations': './src/translations/*',
                 '@hooks': './src/hooks/*',
                 '@contexts': './src/contexts/*',
                 '@styles': './src/styles/*',
                 '@images': './src/images/*',
                 '@config/*': 'src/config/*',
                 '@nav/*': 'scr/nav/*',
                 '@ultis/*': 'src/ultis/*',
                 '@svgs/*': 'src/svgs/*',
                 '@types/*': 'src/types/*',
                 '@libs/*': 'src/libs/*',
              },
           },
        ],
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        'react-native-reanimated/plugin',
     ],
  };
};
