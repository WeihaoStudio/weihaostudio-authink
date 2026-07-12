import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "./KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "login-update-password.ftl" });
const meta = { title: "login/LoginUpdatePassword", component: KcPageStory } satisfies Meta<typeof KcPageStory>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const AppInitiatedAction: Story = {
    args: { kcContext: { isAppInitiatedAction: true } }
};
export const ServerMessage: Story = {
    args: { kcContext: { message: { type: "warning", summary: "密码必须符合安全策略" } } }
};
