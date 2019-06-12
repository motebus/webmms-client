import alias from 'rollup-plugin-alias'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import replace from 'rollup-plugin-replace';

export default {
    input: 'src/main.js',
    output: {
        name: 'webmms',
        file: 'dist/bundle.js',
        format: 'umd'
    },
    plugins: [
        alias({
            resolve: ['js'],
            actions: './actions',
            reducers: './reducers'
        }),
        replace({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
        }),
        resolve({
            mainFields: ['module', 'main'],
            browser: true
        }),
        commonjs(),
    ]
}