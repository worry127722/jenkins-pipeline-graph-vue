module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: ['plugin:vue/essential'],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'off' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'off' : 'off'
    },
    parserOptions: {
        parser: 'babel-eslint'
    }
};
