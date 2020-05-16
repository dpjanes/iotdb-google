/*
 *  drive/parse_path.js
 *
 *  David Janes
 *  IOTDB.org
 *  2020-05-15
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

const URL = require("path").URL

/**
 */
const _drive = _.promise((self, done) => {
    const parts = self.path.split("/")
    if (parts.length <= 1) {
        throw new errors.Invalid("can't deal with /")
    }

    parts.shift()
    const root = parts.shift()

    const paramd = {
        useDomainAdminAccess: true,
        q: `name = '${root}'`,
    }

    self.google.drive.drives.list(paramd, (error, response) => {
        if (error) {
            if (error.response && error.response.status) {
                return done(new errors.NotFound(
                    `${error.response.status}: ${error.response.statusText || "?"} (${self.fileId})`, 
                    error.response.status))
            }

            return done(error)
        }

        if (response.data.drives.length < 1) {
            throw new errors.NotFound(`not found: ${root}`)
        }

        parts.unshift(response.data.drives[0].id)
        self.path = parts.join("/")

        done(null, self)
    })
})

_drive.method = "drive.parse_path/_drive"
_drive.description = ``
_drive.requires = {
}
_drive.accepts = {
}
_drive.produces = {
}

/**
 */
const _next = _.promise((self, done) => {
    if (!self.parent) {
        return done(null, self)
    }

    const paramd = {}
    if (self.path) {
        paramd.driveId = self.root
        paramd.corpora = "drive"
        paramd.includeItemsFromAllDrives = true
        paramd.supportsAllDrives = true
        paramd.q = `'${self.parent}' in parents and name = '${self.name}'`
    }

    self.google.drive.files.list(paramd, {}, (error, response) => {
        if (error) {
            if (error.response && error.response.status) {
                const message = _.d.first(error, "/response/data/error/message", "?")
                return done(new errors.NotFound(
                    `${error.response.status}: ${message} (${self.path})`, 
                    error.response.status))
            }

            return done(error)
        }

        if (response.data.files.length === 0) {
            self.parent = null
        } else {
            self.parent = response.data.files[0].id
        }

        done(null, self)
    })
})

_next.method = "drive.parse_path/_next"
_next.description = ``
_next.requires = {
    parent: _.is.String,
    name: _.is.String,
}
_next.accepts = {
}
_next.produces = {
    parent: _.is.String,
}

/**
 */
const parse_path = _.promise((self, done) => {
    _.promise(self)
        .validate(parse_path)

        .conditional(sd => sd.path.startsWith("/"), _drive)
        .make(sd => {
            sd.finished = false
            sd.parts = sd.path.split("/")
            sd.parent = sd.parts.shift()
            sd.root = sd.parent
        })
        .each({
            method: _next,
            inputs: "parts:name",
            outputs: "parents",
            output_selector: sd => sd.parent,
            roll_self: true,
        })

        .make(sd => {
            sd.parts.unshift(sd.root)
            sd.parents.unshift(sd.root)

            if (sd.parents.length === 0) {
                throw new errors.Invalid("don't understand the path")
            } else if (sd.parents.length === 1) {
                sd.path = sd.parents[0]
            } else if (_.is.Nullish(sd.parents[sd.parents.length - 2])) {
                throw new errors.NotFound("folder not found: " + self.path)
            } else if (_.is.Nullish(sd.parents[sd.parents.length - 1])) {
                sd.path = `${sd.parents[sd.parents.length - 2]}/${sd.parts[sd.parents.length - 1]}`
            } else {
                sd.path = sd.parents[sd.parents.length - 1]
            }
        })

        .end(done, self, parse_path)
})

parse_path.method = "drive.parse_path"
parse_path.requires = {
    path: _.is.String,
    google: {
        drive: _.is.Object,
    },
}
parse_path.produces = {
    path: _.is.String,
}
parse_path.params = {
    path: _.p.normal,
}
parse_path.p = _.p(parse_path)

/**
 *  API
 */
exports.parse_path = parse_path;
