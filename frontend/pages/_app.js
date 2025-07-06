import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider, getDefaultConfig,createConfig } from 'wagmi';
import { hardhat, sepolia, monadTestnet } from 'wagmi/chains';
import { http } from 'viem';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '../styles/globals.css';

const { connectors } = getDefaultWallets({
  appName: 'Mon Warrior',
  projectId: 'YOUR_PROJECT_ID', // 替换为实际项目 ID
  chains: [monadTestnet],
});

const config = createConfig({
  chains: [monadTestnet],
  transports: {
    [monadTestnet.id]: http(),
  },
  connectors,
  ssr: true,
});

// 2. 初始化 TanStack Query
const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Component {...pageProps} />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default MyApp;