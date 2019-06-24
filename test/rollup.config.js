import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import alias from 'rollup-plugin-alias'

export default {
    input: 'test/main.js',
    output: {
        name: 'test',
        file: 'test/test.js',
        format: 'umd'
    },
    plugins: [
        alias({
            resolve: ['js'],
            webmms: 'dist/bundle.js'
        }),
        resolve({
            mainFields: ['module', 'main'],
            browser: true
        }),
        commonjs(),
    ]
}