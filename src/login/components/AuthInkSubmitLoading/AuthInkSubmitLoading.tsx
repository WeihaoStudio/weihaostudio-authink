import { InkLoading } from "../InkLoading";

export type AuthInkSubmitLoadingProps = {
    message?: string;
    ariaLabel?: string;
    size?: number;
    paused?: boolean;
};

export function AuthInkSubmitLoading({
    message = "正在验证身份…",
    ariaLabel = "正在验证身份，请稍候",
    size = 64,
    paused = false
}: AuthInkSubmitLoadingProps) {
    return (
        <span
            className="authink-submit-loading"
            role="status"
            aria-live="polite"
            aria-label={ariaLabel}
        >
            <span className="authink-submit-loading__visual" aria-hidden="true">
                <InkLoading size={size} announce={false} paused={paused} />
            </span>
            <span className="authink-submit-loading__message">{message}</span>
        </span>
    );
}
