import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "./KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "login.ftl" });

const meta = {
    title: "AuthInk/Login",
    component: KcPageStory,
    parameters: {
        layout: "fullscreen"
    }
} satisfies Meta<typeof KcPageStory>;

export default meta;
type Story = StoryObj<typeof meta>;

const socialProviders = [
    {
        loginUrl: "#google",
        alias: "google",
        providerId: "google",
        displayName: "Google"
    },
    {
        loginUrl: "#github",
        alias: "github",
        providerId: "github",
        displayName: "GitHub"
    }
];

export const Default: Story = {
    args: {
        kcContext: {
            social: {
                displayInfo: true,
                providers: socialProviders
            }
        }
    }
};

export const InvalidCredentials: Story = {
    args: {
        kcContext: {
            login: { username: "weihao@example.com" },
            message: {
                type: "error",
                summary: "用户名或密码错误，请重新输入。"
            },
            social: {
                displayInfo: true,
                providers: socialProviders
            }
        }
    }
};

export const Dark: Story = {
    args: {
        kcContext: {
            authinkTheme: "dark",
            social: {
                displayInfo: true,
                providers: socialProviders
            }
        }
    },
    parameters: {
        backgrounds: { default: "dark" }
    }
};

export const PasswordOnly: Story = {
    args: {
        kcContext: {
            usernameHidden: true,
            login: { username: "weihao@example.com" },
            social: { displayInfo: false, providers: [] }
        }
    }
};
