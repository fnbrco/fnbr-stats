module.exports = {
    "env": {
        "node": true,
        "es6" : true
    },
    "parserOptions" : {
        "ecmaVersion" : 8
    },
    "extends": "eslint:recommended",
    "rules": {
        "indent": [
            "error",
            4
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-unused-vars" : [
            0
        ],
        "no-trailing-spaces" : [
            "warn"
        ],
        "no-extra-semi" : [
            "error"
        ],
        "no-console" : [
            0
        ],
        "semi-spacing" : [
            "error",
            {"before": false, "after": true}
        ],
        "eol-last" : [
            "error",
            "always"
        ]
    },
    "globals" : {
        "config" : false,
        "Redis": true
    }
};
