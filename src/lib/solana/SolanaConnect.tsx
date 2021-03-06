import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { ConnectionProvider, useWallet, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork, WalletError } from '@solana/wallet-adapter-base';
import {
    getLedgerWallet,
    getPhantomWallet,
    getSlopeWallet,
    getSolflareWallet,
    getSolletExtensionWallet,
    getSolletWallet,
    getTorusWallet,
} from '@solana/wallet-adapter-wallets';
import toast, { Toaster } from 'react-hot-toast';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { StakeSol } from './StakeSol';
import { Notification } from './Notification';


// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css');
interface walletProps {
    network: string;
    voteAddress: string;
    validatorName: string;
}

const Wallet = (props?: walletProps) => {
    // Can be set to 'devnet', 'testnet', or 'mainnet-beta'
    const network: string | any = props?.network;

    // You can also provide a custom RPC endpoint
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking --
    // Only the wallets you configure here will be compiled into your application
    const wallets = useMemo(() => [
        getPhantomWallet(),
        // getSlopeWallet(),
        getSolflareWallet(),
        // getLedgerWallet(),
        getSolletWallet({ network }),
        getSolletExtensionWallet({ network }),
    ], [network]);



    const onError = useCallback(
        (error: WalletError) =>
            toast.custom(
                <Notification
                    message={error.message ? `${error.name}: ${error.message}` : error.name}
                    variant="error"
                />
            ),
        []
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} onError={onError} autoConnect>
                <WalletModalProvider >
                    <WalletMultiButton style={{  }} />
                    {/* <WalletDisconnectButton /> */}
                    <StakeSol  network={props?.network || ''} voteAddress={props?.voteAddress || ''} validatorName={props?.validatorName || ''}/>
                </WalletModalProvider>
                <Toaster position="bottom-left" reverseOrder={false} />
            </WalletProvider>
        </ConnectionProvider>
    );
}

export default Wallet
