import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function HoveringWalletButton() {
    return (
        <div className="fixed bottom-4 right-4 z-50">
            <ConnectButton />
        </div>
    )
}