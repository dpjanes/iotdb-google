/*
 *  drive/parse.js
 *
 *  David Janes
 *  IOTDB.org
 *  2019-09-25
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

/**
 */
const parse = _.promise((self, done) => {
    const google = require("..")

    _.promise(self)
        .validate(parse)

        .make(sd => {
            if (_.is.Dictionary(sd.path) && sd.path.id) {
                sd.path = sd.id
            }

            if (_.is.AbsoluteURL(sd.path)) {
                sd._op = "url"
                sd.url = sd.path
            } else if (self.path.indexOf("/") > -1) {
                sd._op = "path"
            } else {
                sd._op = "asis"
            }
        })

        .conditional(sd => sd._op === "url", google.drive.parse_url)
        .conditional(sd => sd._op === "path", google.drive.parse_path)

        .make(sd => {
            if (sd._parse_variable) {
                _.d.set(sd, sd._parse_variable, sd.path)
            }
        })

        .end(done, self, `${self._parse_variable || "path"}`)
})

parse.method = "drive.parse"
parse.requires = {
    path: [ _.is.String, _.is.Dictionary ],
}
parse.accepts = {
    path: {
        id: _.is.Dictionary,
    },
    _parse_variable: _.is.String, // only use through parameterized
}
parse.produces = {
    path: _.is.String,
}

/**
 */
const parameterized = (_path, _parse_variable) => _.promise((self, done) => {
    _.promise(self)
        .validate(parameterized)

        .add("path", _path || sd.path)
        .add("_parse_variable", _parse_variable)
        .then(parse)

        .end(done, self, `${_parse_variable || "path"}`)
})

parameterized.method = "drive.parse.p"
parameterized.description = ``
parameterized.requires = {
}
parameterized.accepts = {
}

/**
 *  API
 */
exports.parse = parse
exports.parse.p = parameterized
