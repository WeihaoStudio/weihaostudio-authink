import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "./KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "login-reset-password.ftl" });
const meta = { title: "login/LoginResetPassword", component: KcPageStory } satisfies Meta<typeof KcPageStory>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Email: Story = {
    args: {
        kcContext: {
            realm: { loginWithEmailAllowed: true, registrationEmailAsUsername: true }
        }
    }
};

export const Username: Story = {
    args: { kcContext: { realm: { loginWithEmailAllowed: false } } }
};

export const AttemptedIdentity: Story = {
    args: { kcContext: { auth: { attemptedUsername: "weihao@example.com" } } }
};
