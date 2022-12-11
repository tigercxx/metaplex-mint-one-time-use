import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
    Transaction,
    LAMPORTS_PER_SOL,
    TransactionSignature,
    SystemProgram,
    PublicKey,
} from "@solana/web3.js";
import { FC, useCallback } from "react";
import {
    Metaplex,
    walletAdapterIdentity,
    bundlrStorage,
    BundlrStorageDriver,
    Amount,
} from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, Keypair } from "@solana/web3.js";

export const RequestPay: FC = () => {
    const { connection } = useConnection();
    // const { publicKey, sendTransaction } = useWallet();
    const wallet = useWallet();
    const SOL_PRICE_OF_LIKE = 0.1;

    //REMOVE HARDCODED AUTHORS & SHARES LATER
    const authors = [
        "7WNRBicA8MmZ5U7gnKZ6FhgVwZrfa915zZ8QS8vYL2sj",
        "FkvNBs5TruvbAuUkrKdBXZW9zJSrRi6ZrV8n5Fjnad7F",
        "5ZQcbNFk17uNfZEK1hVvs2NrMBRXLVGNsjK6iSewDbEH",
    ];
    const shares = [7000, 2000, 1000];
    const metaplex = Metaplex.make(connection)
        .use(walletAdapterIdentity(wallet))
        .use(
            bundlrStorage({
                address: "https://devnet.bundlr.network",
                providerUrl:
                    "https://shy-frequent-resonance.solana-devnet.discover.quiknode.pro/599801ea48c337f34c36579cb1d17a6836979506/",
                timeout: 60000,
            })
        );
    const bundlrs = metaplex.storage().driver() as BundlrStorageDriver;

    const onClick = useCallback(async () => {
        if (!wallet.publicKey) {
            console.log("error", "Wallet not connected!");
            alert("Wallet not Connected!");
            return;
        }
        // const transaction = new Transaction();
        try {
            // for(let i = 0; i < authors.length; i++){
            //     const ix = SystemProgram.transfer({
            //             fromPubkey: publicKey,
            //             toPubkey: new PublicKey(authors[i]),
            //             lamports: LAMPORTS_PER_SOL * SOL_PRICE_OF_LIKE * (shares[i]/10000)
            //         });
            //     transaction.add(ix);
            // }

            // const tx = await sendTransaction(transaction, connection);
            // await connection.confirmTransaction({
            //     blockhash: (await connection.getLatestBlockhash("max")).blockhash,
            //     lastValidBlockHeight: (await connection.getLatestBlockhash("max")).lastValidBlockHeight,
            //     signature: tx,
            // });
            (await bundlrs.bundlr()).fund(1000);
            const { uri } = await metaplex.nfts().uploadMetadata({
                name: "Title of Article1",
                description: "Description of Article",
                image: "https://nftstorage.link/ipfs/bafkreiexugso4wk3ugovkz5zi6nbhvr4h3zysg5pwtmmvppt4y7rpypwnq",
                properties: {
                    files: [
                        {
                            type: "application/pdf",
                            uri: "https://bafybeihl3blczdgz4vvnvmn4vlyscqrqogiy5nvz6i7mgpnat4zjrtzr6y.ipfs.nftstorage.link/",
                        },
                    ],
                },
            });
            const { nft } = await metaplex.nfts().create({
                uri: uri,
                name: "Title of Article",
                sellerFeeBasisPoints: 500, // Represents 5.00%.
                symbol: "OYC1",
                updateAuthority: metaplex.identity(),
                creators: [
                    {
                        address: wallet.publicKey,
                        authority: metaplex.identity(),
                        share: 100,
                    },
                ],
                isMutable: false,
            });
            alert("Transaction Confirmed!");
        } catch (error: any) {
            alert(error);
            console.log(error);
        }
    }, [wallet.publicKey, connection]);

    return (
        <div>
            <button
                className="px-8 m-2 btn animate-pulse bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ..."
                onClick={onClick}
            >
                <span>LESGOOOOOO</span>
            </button>
        </div>
    );
};
