import { InkLoading } from "../login/components/InkLoading";

type AccountLoadingVariant = "page" | "section" | "inline";

const loadingSizeByVariant: Record<AccountLoadingVariant, number> = {
    page: 72,
    section: 64,
    inline: 32
};

export function AccountLoading({
    variant = "page"
}: {
    variant?: AccountLoadingVariant;
}) {
    return (
        <div className={`authink-account-loading authink-account-loading--${variant}`}>
            <InkLoading
                size={loadingSizeByVariant[variant]}
                speed={0.75}
                label="账户中心加载中"
            />
        </div>
    );
}
