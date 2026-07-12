import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "./KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "login-verify-email.ftl" });

const meta = {
    title: "login/LoginVerifyEmail",
    component: KcPageStory
} satisfies Meta<typeof KcPageStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        kcContext: { user: { email: "weihao@example.com" } }
    }
};

export const OlderKeycloakWithoutEmail: Story = {
    args: { kcContext: { user: undefined } }
};

export const MessageSent: Story = {
    args: {
        kcContext: {
            message: { type: "info", summary: "验证邮件已发送" }
        }
    }
};
