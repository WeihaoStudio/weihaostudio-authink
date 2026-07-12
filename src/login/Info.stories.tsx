import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "./KcPageStory";
const { KcPageStory } = createKcPageStory({ pageId: "info.ftl" });
const meta = { title: "login/Info", component: KcPageStory } satisfies Meta<typeof KcPageStory>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Success: Story = { args: { kcContext: { messageHeader: "操作完成", message: { type: "success", summary: "邮箱已验证。" } } } };
export const RequiredActions: Story = { args: { kcContext: { requiredActions: ["UPDATE_PASSWORD"] } } };
