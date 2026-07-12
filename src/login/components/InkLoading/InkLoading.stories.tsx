import type { Meta, StoryObj } from "@storybook/react";
import { InkLoading } from "./InkLoading";

const meta = {
    title: "AuthInk/InkLoading",
    component: InkLoading,
    parameters: { layout: "centered" },
    args: { label: "加载中" }
} satisfies Meta<typeof InkLoading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
    render: () => (
        <div style={{ display: "flex", alignItems: "end", gap: 28 }}>
            {[16, 24, 32, 48, 64].map(size => (
                <span key={size} style={{ display: "grid", justifyItems: "center", gap: 8 }}>
                    <InkLoading size={size} announce={false} />
                    <small>{size}px</small>
                </span>
            ))}
        </div>
    )
};

export const LightDark: Story = {
    render: () => (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", border: "1px solid #d8d2c8" }}>
            <div style={{ padding: 48, background: "#f7f4ef", color: "#171a1d" }}>
                <InkLoading size={48} announce={false} />
            </div>
            <div style={{ padding: 48, background: "#101b21", color: "#fff" }}>
                <InkLoading size={48} announce={false} style={{ filter: "invert(1)" }} />
            </div>
        </div>
    )
};

export const ReducedMotion: Story = {
    render: () => (
        <div style={{ display: "grid", justifyItems: "center", gap: 12 }}>
            <InkLoading paused size={48} />
            <small>减少动态效果时显示完整静态笔触</small>
        </div>
    )
};

export const Paused: Story = { args: { paused: true } };

export const InlineWithText: Story = {
    render: () => (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
            <InkLoading size={24} announce={false} />
            正在准备安全页面…
        </span>
    )
};

export const PageLoadingExample: Story = {
    parameters: { layout: "fullscreen" },
    render: () => (
        <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#f7f4ef" }}>
            <div style={{ display: "grid", justifyItems: "center", gap: 18 }}>
                <InkLoading size={56} label="页面加载中" />
                <span>正在准备安全页面…</span>
            </div>
        </main>
    )
};

export const ButtonLoadingExample: Story = {
    render: () => (
        <button
            type="button"
            aria-busy="true"
            style={{
                minWidth: 220,
                minHeight: 44,
                display: "inline-flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
                border: 0,
                color: "white",
                background: "#171a1d",
                font: "inherit"
            }}
        >
            <InkLoading size={20} announce={false} style={{ filter: "invert(1)" }} />
            正在验证…
        </button>
    )
};
