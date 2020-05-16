/*
 *  drive/_util.js
 *
 *  David Janes
 *  IOTDB.org
 *  2020-03-08
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

const URL = require("url").URL

/**
 */
const is_path = o => {
    if (_.is.String(o)) {
        return true
    } else if (_.is.Dictionary(o) && _.is.String(o.id)) {
        return true
    } else {
        return false
    }
}
is_path.method = "google.drive._util.is_path"

/**
 */
const normalize_path = o => {
    if (_.is.AbsoluteURL(o)) {
        const url = new URL(o)
        const match = url.pathname.match(/.*\/d\/([^\/]*)/)
        if (!match) {
            throw new errors.Invalid(`did not understand URL: ${o}`)
        }

        return match[1]
    } else if (_.is.String(o)) {
        return o
    } else if (_.is.Dictionary(o) && _.is.String(o.id)) {
        return o.id
    } else {
        throw new errors.Invalid(`not a valid path: ${o}`)
    }
}
normalize_path.method = "google.drive._util.normalize_path"

/**
 */
const file_and_folder = p => {
    const parts = p.split("/")
    if (parts.length !== 2) {
        throw new errors.Invalid("expected path to have folder component: " + p)
    }

    return {
        folder: parts[0],
        file: parts[1],
    }
}

/**
 */
const file_only = p => {
    const parts = p.split("/")
    if (parts.length !== 1) {
        throw new errors.Invalid("expected path to have single component: " + p)
    }

    return {
        folder: null,
        file: parts[0],
    }
}

/**
 */
exports.is_path = is_path
exports.normalize_path = normalize_path

exports.file_and_folder = file_and_folder
exports.file_only = file_only
