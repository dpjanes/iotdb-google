/*
 *  auth/interactive.js
 *
 *  David Janes
 *  IOTDB.org
 *  2018-07-29
 *
 *  Copyright [2013-2018] [David P. Janes]
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

"use strict";

const _ = require("iotdb-helpers")

const assert = require("assert")

const logger = require("../logger")(__filename)

/**
 *  When the user code returns a code, this
 *  exchanges it for a token
 */
const _handle_code = _.promise.make((self, done) => {
    const method = "auth.interactive/_handle_code";

    assert.ok(self.code, `${method}: expected self.code after rules.prompt`)

    self.google.client.getToken(self.code, (error, token) => {
        if (error) {
            return done(error)
        }

        self.token = token

        done(null, self)
    })
})

/**
 *  Called when token refreshed (typically a 1 hour lifespan)
 */
const _handle_token_refresh = rules => _.promise.make(self => {
    const method = "auth.interactive/_handle_token_refresh"

    self.google.client.on("tokens", (tokens) => {
        assert.ok(_.is.Object(tokens), `${method}: expected on(tokens) to create Object`)

        const json = Object.assign({}, self.token, tokens)

        _.promise.make(self)
            .then(_.promise.add("token", json))
            .then(rules.write)
            .then(_.promise.make(sd => {
                logger.info({
                    method: method,
                    expires: new Date(sd.token.expiry_date).toISOString(),
                }, "renewed token")
            }))
            .catch(error => {
                delete error.self
                console.log("#", error)

                logger.error({
                    method: method,
                    error: _.error.message(error),
                }, "error saving renewed token")
            })
    })
})

/**
 *  Requires: 
 *  Produces: 
 */
const interactive = rules => _.promise.make((self, done) => {
    const method = "token.interactive";

    assert.ok(self.google, `${method}: expected self.google`)
    assert.ok(self.google.client, `${method}: expected self.google.client`)
    assert.ok(rules.read, `${method}: expected rules.read`)
    assert.ok(rules.write, `${method}: expected rules.write`)
    assert.ok(rules.prompt, `${method}: expected rules.code`)

    _.promise.make(self)
        .then(rules.read)
        .then(_.promise.bail.conditional(sd => sd.token))

        .then(rules.prompt)
        .then(_handle_code)
        .then(rules.write)

        .catch(_.promise.unbail)

        .then(_handle_token_refresh(rules))
        .then(_.promise.make(sd => {
            sd.google.client.setCredentials(sd.token)
        }))
        .then(_.promise.done(done, self))
        .catch(done)
})

/**
 *  API
 */
exports.interactive = interactive;
