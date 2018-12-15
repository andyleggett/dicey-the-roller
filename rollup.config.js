import nodeResolve from 'rollup-plugin-node-resolve'
import loadz0r from 'rollup-plugin-loadz0r'

// Delete 'dist'
//require('rimraf').sync('dist')

export default [{
  input: 'src/bootstrap.js',
  output: {
    file: 'bootstrap.js',
    dir: 'dist',
    dest: 'dist',
    format: 'amd',
    sourcemap: true
  },
  plugins: [
    nodeResolve(),
    loadz0r()
  ]
},
{
  input: 'src/roller-worker.js',
  output: {
    file: 'roller-worker.js',
    dir: 'dist',
    dest: 'dist',
    format: 'amd',
    sourcemap: true
  },
  plugins: [
    nodeResolve(),
    loadz0r()
  ]
}]