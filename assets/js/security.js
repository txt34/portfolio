"use strict";

/*
 * Frontend security helpers.
 *
 * Server-side validation remains mandatory.
 */

const SecureWeb = Object.freeze({

    normalize(value, maxLength = 500) {

        return String(value ?? "")
            .normalize("NFKC")
            .trim()
            .slice(0, maxLength);
    },

    required(value) {

        return String(value ?? "")
            .trim()
            .length > 0;
    },

    isValidEmail(value) {

        const email =
            String(value ?? "").trim();

        if (email.length > 254) {
            return false;
        }

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            .test(email);
    },

    validatePassword(value) {

        const password =
            String(value ?? "");

        return {
            valid:
                password.length >= 12 &&
                password.length <= 128
        };
    },

    setText(element, value) {

        if (
            !(element instanceof Element)
        ) {

            throw new TypeError(
                "Expected DOM element."
            );
        }

        element.textContent =
            String(value ?? "");
    },

    isSafeUrl(value) {

        try {

            const url =
                new URL(
                    value,
                    window.location.origin
                );

            return [
                "http:",
                "https:"
            ].includes(
                url.protocol
            );

        }
        catch {

            return false;
        }
    }
});

window.SecureWeb =
    SecureWeb;