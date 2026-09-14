"use strict";

/*
 * Centralized API helper.
 *
 * Authentication, authorization, validation,
 * and CSRF protection must still be implemented
 * server-side.
 */

const API = Object.freeze({

    async request(
        url,
        options = {}
    ) {

        const response =
            await fetch(
                url,
                {
                    credentials:
                        "same-origin",

                    headers: {
                        "Accept":
                            "application/json",

                        ...(
                            options.headers ||
                            {}
                        )
                    },

                    ...options
                }
            );

        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );
        }

        return response.json();
    }
});

window.API =
    API;