"use strict";

document.addEventListener(
    "DOMContentLoaded",
    () => {

        document
            .querySelectorAll(
                "[data-current-page]"
            )
            .forEach(
                element => {

                    element.setAttribute(
                        "aria-current",
                        "page"
                    );
                }
            );
    }
);