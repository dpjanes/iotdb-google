/*
 *  sheets/_util.js
 *
 *  David Janes
 *  IOTDB.org
 *  2019-07-05
 *
 *  Copyright [2013-2019] [David P. Janes]
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

const parse_range = (text, sheets) => {
    const result = {
        "sheetId": null,
        "startRowIndex": null,
        "endRowIndex": null,
        "startColumnIndex": null,
        "endColumnIndex": null
    }

    const match = text.match(/^(([^!]+)!)?([A-Za-z]*)(\d*)(:([A-Za-z]*)(\d*))?$/)
    if (!match) {
        return result
    }

    if (sheets && match[2]) {
        const sheet = sheets.find(sheet => sheet.title === match[2])
        if (sheet) {
            result.sheetId = sheet.sheetId
        } else {
            throw new errors.Invalid("unknown sheet: " + match[2])
        }
    }

    result.startColumnIndex = match[3] ? letter_to_column(match[3]) : null
    result.startRowIndex = match[4] ? number_to_row(match[4]) : null
    result.endColumnIndex = match[6] ? letter_to_column(match[6]) + 1 : match[3] ? result.startColumnIndex + 1 : null
    result.endRowIndex = match[7] ? number_to_row(match[7]) + 1 : match[4] ? result.startRowIndex + 1 : null
    // console.log("MATCH", match, result)

    return result
}

/*
const tests = [
    {
        "cell": "A1",
        "expect": {
            "sheetId": null,
            "startColumnIndex": 0,
            "startRowIndex": 0,
            "endColumnIndex": 1,
            "endRowIndex": 1,
        },
    },
    {
        "cell": "Z10",
        "expect": {
            "sheetId": null,
            "startColumnIndex": 25,
            "startRowIndex": 9,
            "endColumnIndex": 26,
            "endRowIndex": 10,
        },
    },
    {
        "cell": "A",
        "expect": {
            "sheetId": null,
            "startColumnIndex": 0,
            "startRowIndex": null,
            "endColumnIndex": 1,
            "endRowIndex": null,
        },
    },
    {
        "cell": "A:B",
        "expect": {
            "sheetId": null,
            "startColumnIndex": 0,
            "startRowIndex": null,
            "endColumnIndex": 2,
            "endRowIndex": null,
        },
    },
]

tests.forEach(test => {
    const assert = require("assert")

    console.log("-", test.cell)
    const result = parse_range(test.cell)
    assert.deepEqual(result, test.expect)

})

console.log(letter_to_column("A"))
console.log(letter_to_column("B"))
console.log(letter_to_column("Z"))
console.log(letter_to_column("AA"))
console.log(letter_to_column("AZ"))
console.log(letter_to_column("BA"))
*/

exports.parse_range = parse_range
