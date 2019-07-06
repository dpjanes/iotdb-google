/*
 *  sheets/add_request.js
 *
 *  David Janes
 *  IOTDB.org
 *  2019-07-06
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

const assert = require("assert")

/**
 */
const parameterized = (key, request) => _.promise(self => {
    self.requests = self.requests || []

    assert.ok(_.is.String(key))
    assert.ok(_.is.JSON(request))

    self.requests.push({
        [ key ]: request,
    })
})

const add_request = {}
add_request.method = "sheets.batch.add_request"
add_request.description = "Add a request (paramterized only)"

/**
 *  API
 */
exports.add_request = {}
exports.add_request.p = parameterized;
