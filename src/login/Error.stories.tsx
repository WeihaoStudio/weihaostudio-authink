import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "./KcPageStory";
const { KcPageStory } = createKcPageStory({ pageId: "error.ftl" });
const meta = { title: "login/Error", component: KcPageStory } satisfies Meta<typeof KcPageStory>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Expired: Story = { args: { kcContext: { message: { type: "error", summary: "请求已失效，请重新开始。" } } } };
export const NoReturnLink: Story = { args: { kcContext: { skipLink: true } } };
