"use strict";

const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;

const ICO_CONTRACT_ADDRESS = "0xcFCda1F3bE73B9e45E5D1139D45b737453C5E296";
const TOKEN_CONTRACT = "0x2fe4902233EaFB3706fF05533da45BCDe238c1E7";
const NETWORK_ID = 5;
const NETWORK_NAME = "Goerli";

const ICOABI = [{"constant":true,"inputs":[],"name":"rate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"weiRaised","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"wallet","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"remainingTokens","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"tokenWallet","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"beneficiary","type":"address"}],"name":"buyTokens","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"token","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"rate","type":"uint256"},{"name":"wallet","type":"address"},{"name":"token","type":"address"},{"name":"tokenWallet","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"purchaser","type":"address"},{"indexed":true,"name":"beneficiary","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"TokensPurchased","type":"event"}];


// Web3modal instance
let web3Modal

// Chosen wallet provider given by the dialog window
let provider;


// Address of the selected account
let selectedAccount;

function init() {

    console.log("Initializing example");
    console.log("WalletConnectProvider is", WalletConnectProvider);
    console.log("window.web3 is", window.web3, "window.ethereum is", window.ethereum);

    // Tell Web3modal what providers we have available.
    // Built-in web browser provider (only one can exist as a time)
    // like MetaMask, Brave or Opera is added automatically by Web3modal
    const providerOptions = {
        walletconnect: {
            package: WalletConnectProvider,
            options: {
                // Mikko's test key - don't copy as your mileage may vary
                infuraId: "0b184a8d42254b289c25034d52459a7d",
            }
        }
    };

    web3Modal = new Web3Modal({
        cacheProvider: false, // optional
        providerOptions, // required
        disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
    });

    console.log("Web3Modal instance is", web3Modal);
}

async function fetchAccountData() {

    const network = await provider.getNetwork();
    const chainId = network.chainId;

    if (chainId !== NETWORK_ID) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: `Contract is not deployed on the selected network please choose ${NETWORK_NAME} network`
        })
        await onDisconnect();
        return;
    }

    // Get list of accounts of the connected wallet
    let signer = provider.getSigner();
    const accounts = await signer.getAddress();

    // MetaMask does not give you all accounts, only the selected account
    console.log("Got accounts", accounts);
    selectedAccount = accounts;

}

async function refreshAccountData() {
    document.querySelector("#btn-connect").style.display = 'none';
    document.querySelector("#btn-disconnect").style.display = 'block';
    await fetchAccountData(provider);
}

/**
* Connect wallet button pressed.
*/
async function onConnect() {

    console.log("Opening a dialog", web3Modal);
    try {
        const instance = await web3Modal.connect();
        provider = new ethers.providers.Web3Provider(instance);
        console.log(provider)
    } catch (e) {
        console.log("Could not get a wallet connection", e);
        return;
    }

    // Subscribe to accounts change
    window.ethereum.on("accountsChanged", (accounts) => {
        fetchAccountData();
    });

    // Subscribe to chainId change
    window.ethereum.on("chainChanged", (chainId) => {
        fetchAccountData();
    });

    await refreshAccountData();
}


/**
* Disconnect wallet button pressed.
*/
async function onDisconnect() {

    console.log("Killing the wallet connection", provider);

    // TODO: Which providers have close method?
    if (provider.close) {
        await provider.close();

        // If the cached provider is not cleared,
        // WalletConnect will default to the existing session
        // and does not allow to re-scan the QR code with a new wallet.
        // Depending on your use case you may want or want not his behavir.
        await web3Modal.clearCachedProvider();
        provider = null;
    }

    selectedAccount = null;

    // Set the UI back to the initial state
    document.querySelector("#btn-connect").style.display = "block";
    document.querySelector("#btn-disconnect").style.display = "none";
}


async function buyTokenContract(price) {
    try {
        let signer = provider.getSigner();
        let icoContract = new ethers.Contract(ICO_CONTRACT_ADDRESS, ICOABI, signer);
        let estimateGas = await icoContract.estimateGas.buyTokens(selectedAccount, { from: selectedAccount, value: price });
        console.log(estimateGas.toString())
        let tx = await icoContract.buyTokens(selectedAccount, { from: selectedAccount, value: price,  gasLimit: estimateGas.toString() });
        await tx.wait();
        Swal.fire({
            icon: 'success',
            text: `Purchase Done`
        })
    } catch (e) {
        stopLoading();
    }
}

async function startLoading() {
    document.querySelector("#btnBuy").setAttribute('disabled', 'disabled');
    document.querySelector('#btnBuy').innerHTML = 'Processing...';
}

async function stopLoading() {
    document.querySelector("#btnBuy").removeAttribute('disabled');
    document.querySelector('#btnBuy').innerHTML = 'Buy';
}

async function buyTokens() {
    let amount = document.querySelector('#amount').value;
    if (amount === '') {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: `Please enter Amount`
        })
        return;
    }

    const regExp = /^[0-9]\d*(\.\d+)?$/;
    if (!amount.match(regExp)) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: `Please enter the correct amount`
        })
        return;
    }

    if (selectedAccount !== null && selectedAccount !== undefined) {
        try {
            let signer = provider.getSigner();
            const price = ethers.utils.parseEther(amount);
            startLoading();
            await buyTokenContract(price)
            stopLoading();
        } catch (e) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: `Something went wrong`
            })
        }
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: `Connect your wallet`
        })
    }
}

async function addToken() {
    const tokenAddress = TOKEN_CONTRACT;
    const tokenSymbol = "PUPIPAY";
    const tokenDecimals = 18;
    const tokenImage = '';

    try {
        // wasAdded is a boolean. Like any RPC method, an error may be thrown.
        const wasAdded = await window.ethereum.request({
            method: 'wallet_watchAsset',
            params: {
                type: 'ERC20', // Initially only supports ERC20, but eventually more!
                options: {
                    address: tokenAddress, // The address that the token is at.
                    symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
                    decimals: tokenDecimals, // The number of decimals in the token
                    image: tokenImage, // A string url of the token logo
                },
            },
        });

        if (wasAdded) {
            console.log('Thanks for your interest!');
        } else {
            console.log('Your loss!');
        }
    } catch (error) {
        console.log(error);
    }
}


/**
 * Main entry point.
 */
window.addEventListener('load', async () => {
    init();
    document.querySelector("#btn-connect").addEventListener("click", onConnect);
    document.querySelector("#btn-disconnect").addEventListener("click", onDisconnect);
});