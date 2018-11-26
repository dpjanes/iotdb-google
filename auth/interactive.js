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
const _handle_code = _.promise((self, done) => {
    _.promise.validate(self, _handle_code)

    self.google.client.getToken(self.code, (error, token_response) => {
        if (error) {
            return done(error)
        }

        self.googled = Object.assign(
            {},
            self.googled || {},
            {
                token: token_response,
            }
        )

        done(null, self)
    })
})

_handle_code.method = "auth.interactive/_handle_code"
_handle_code.requires = {
    code: _.is.String,
}
_handle_code.accepts = {
    googled: _.is.Dictionary,
}

/**
 *  Called when token refreshed (typically a 1 hour lifespan).
 *  This does not return anything
 */
const _handle_token_refresh = rules => _.promise(self => {
    self.google.client.on("tokens", token_response => {
        assert.ok(_.is.Dictionary(token_response), 
            `${_handle_token_refresh.method}: expected on(token_response) to create Object`)

        _.promise(self)
            .add({
                googled: {
                    token: token_response,
                },
            })
            .then(rules.write)
            .make(sd => {
                logger.info({
                    method: _handle_token_refresh.method,
                    expires: new Date(sd.token.expiry_date).toISOString(),
                }, "renewed token")
            })
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

_handle_token_refresh.method = "auth.interactive/_handle_token_refresh"
_handle_token_refresh.requires = {
}

/**
 */
const interactive = rules => _.promise((self, done) => {
    const google = require("..")

    rules = _.d.clone(rules)
    rules.read = rules.read || google.auth.token.read
    rules.write = rules.write || google.auth.token.write

    assert.ok(_.is.Function(rules.read), `${interactive.method}: rules.read is required`)
    assert.ok(_.is.Function(rules.write), `${interactive.method}: rules.write is required`)
    assert.ok(_.is.Function(rules.prompt), `${interactive.method}: rules.prompt is required`)

    _.promise(self)
        .validate(interactive)
        .then(rules.read)
        .then(_.promise.bail.conditional(sd => sd.googled.token))

        .then(rules.prompt)
        .then(_handle_code)
        .then(rules.write)

        .catch(_.promise.unbail)

        .then(_handle_token_refresh(rules))
        .then(google.auth.token)
        .end(done, self, "googled")
})

interactive.method = "token.interactive"
interactive.requires = {
    google: {
        client: _.is.Object,
    },
}

/**
 *  API
 */
exports.interactive = interactive;
