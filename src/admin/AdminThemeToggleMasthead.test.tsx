import { cleanup, render, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { AdminThemeToggle } from "./AdminThemeToggle";

function renderMasthead() {
    document.body.innerHTML = `
        <header class="pf-v5-c-masthead">
            <div class="pf-v5-c-masthead__content">
                <div class="pf-v5-c-toolbar__content-section">
                    <div class="pf-v5-c-toolbar__item"><button type="button">Help</button></div>
                    <div class="pf-v5-c-toolbar__item"><button type="button">weihao li</button></div>
                </div>
            </div>
        </header>
    `;

    return document.querySelector<HTMLElement>(".pf-v5-c-toolbar__content-section")!;
}

describe("AuthInk Admin theme toggle masthead placement", () => {
    afterEach(() => {
        cleanup();
        document.body.innerHTML = "";
    });

    it("mounts in the masthead toolbar instead of floating over the user menu", async () => {
        const toolbarSection = renderMasthead();
        render(<AdminThemeToggle initialTheme="light" />);

        const toggle = await within(toolbarSection).findByRole("button", {
            name: "切换到夜间主题"
        });

        expect(toggle.parentElement).toHaveClass("authink-admin-theme-toggle-slot");
        expect(toolbarSection.firstElementChild).toBe(toggle.parentElement);
    });
});
