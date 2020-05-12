/*
 *  sheets/util.js
 *
 *  David Janes
 *  IOTDB.org
 *  2020-05-12
 *
 *  Copyright (2013-2020) David P. Janes
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

"use strict"

const _ = require("iotdb-helpers")
const errors = require("iotdb-errors")

const A = "A".charCodeAt(0)
const letter_to_column = _letters => _letters
        .toUpperCase()
        .split("")
        .map(letter => letter.charCodeAt(0) - A + 1)
        .reduce((v, number, x, vs) => v + number * Math.pow(26, vs.length - x - 1), 0) - 1
const number_to_row = _number => parseInt(_number) - 1

const column_to_letter = _column => {
    _column += 1
    let temp, letter = '';
    while (_column > 0) {
        temp = (_column - 1) % 26;
        letter = String.fromCharCode(temp + 65) + letter;
        _column = (_column - temp - 1) / 26;
    }

    return letter;
}

/**
 *  API
 */
exports.util = {
    column: {
        number: letter_to_column,
        letter: column_to_letter,
    },
}
