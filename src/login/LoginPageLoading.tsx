import { InkLoading } from "./components/InkLoading";
import "./authink.tokens.css";
import "./authink.css";

export function LoginPageLoading() {
    return (
        <main className="authink-page-loading" data-theme="light">
            <InkLoading size={64} speed={0.75} label="页面加载中" />
        </main>
    );
}
