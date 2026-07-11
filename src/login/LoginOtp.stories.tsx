import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "./KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "login-otp.ftl" });

const meta = {
    title: "AuthInk/TOTP",
    component: KcPageStory,
    parameters: { layout: "fullscreen" }
} satisfies Meta<typeof KcPageStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InvalidCode: Story = {
    args: {
        kcContext: {
            messagesPerField: {
                existsError: (fieldName: string) => fieldName === "totp",
                get: () => "动态验证码不正确或已过期，请重新输入。"
            }
        }
    }
};
