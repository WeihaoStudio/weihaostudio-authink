import type { Meta, StoryObj } from "@storybook/react";
import { AuthInkSubmitLoading } from "./AuthInkSubmitLoading";
import "../../authink.tokens.css";
import "../../authink.css";

function LoadingPreview({
    theme,
    paused = false,
    width = 360
}: {
    theme: "light" | "dark";
    paused?: boolean;
    width?: number;
}) {
    return (
        <main
            className="auth-browser--production"
            data-theme={theme}
            style={{ width, padding: 24, background: "var(--color-canvas)" }}
        >
            <span className="authink-submit-control">
                <button
                    className="button button--primary button--loading-stage"
                    type="button"
                    disabled
                    aria-busy="true"
                    aria-label="正在验证"
                    style={{ width: "100%" }}
                />
                <AuthInkSubmitLoading paused={paused} />
            </span>
        </main>
    );
}

const meta = {
    title: "AuthInk/AuthInkSubmitLoading",
    component: AuthInkSubmitLoading,
    parameters: { layout: "centered" }
} satisfies Meta<typeof AuthInkSubmitLoading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Light: Story = {
    render: () => <LoadingPreview theme="light" />
};

export const Dark: Story = {
    render: () => <LoadingPreview theme="dark" />
};

export const Mobile: Story = {
    parameters: { viewport: { defaultViewport: "mobile1" } },
    render: () => <LoadingPreview theme="light" width={280} />
};

export const ReducedMotionStatic: Story = {
    render: () => <LoadingPreview theme="light" paused />
};
