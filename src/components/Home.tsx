import { useEffect, useState } from 'react';

import { contractABI, contractAddress } from '../utils/constants';
import { BigNumber, ethers } from 'ethers';
import { Loader } from '../components';

const { ethereum } = window;

const getEthereumContract = () => {
	const provider = new ethers.providers.Web3Provider(ethereum);
	const signer = provider.getSigner();
	const lotteryContract = new ethers.Contract(contractAddress, contractABI, signer);

	return lotteryContract;
};

export const Home = () => {
	const [balance, setBalance] = useState<BigNumber | ''>('');
	const [manager, setManager] = useState('');
	const [amount, setAmount] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [players, setPlayers] = useState<Array<string>>([]);

	useEffect(() => {
		const lotteryContract = getEthereumContract();

		lotteryContract.manager().then((manager: string) => setManager(manager));
		lotteryContract.getPlayers().then((players: Array<string>) => setPlayers(players));

		const provider = new ethers.providers.Web3Provider(ethereum);
		provider.getBalance(contractAddress).then((balance: BigNumber) => {
			setBalance(balance);
		});
	}, []);

	const handleSubmit = async (e: any) => {
		e.preventDefault();

		try {
			if (!ethereum) return alert('Please install metamask');
			setIsLoading(true);
			const accounts = await ethereum.request({ method: 'eth_accounts' });
			const lotteryContract = getEthereumContract();
			await lotteryContract.enter({ from: accounts[0], value: ethers.utils.parseEther(amount) });
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	const handlePickWinner = async (e: any) => {
		e.preventDefault();

		try {
			if (!ethereum) return alert('Please install metamask');
			setIsLoading(true);
			const accounts = await ethereum.request({ method: 'eth_accounts' });
			const lotteryContract = getEthereumContract();
			await lotteryContract.pickWinner({ from: accounts[0] });
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="p-5 sm:w-3/4 md:w-1/2 w-full flex flex-col justify-start items-center white-glassmorphism">
			<h2 className="text-3xl sm:text-5xl text-white py-1">Lottery Contract</h2>
			<p className="mt-5 text-white font-light flex px-4 text-base">
				This contract is managed by : {manager}. There are currently {players.length} people entered, competing
				to win {balance !== '' ? ethers.utils.formatEther(balance) : ''} ether!
			</p>

			<div className="flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10">
				<div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center">
					<h4>Want to try your luck?</h4>
					<p className="flex w-full pl-1 text-left text-white font-light text-sm pt-5">
						Amount of ether to enter
					</p>
					<input
						disabled={false}
						placeholder="ether"
						type="number"
						step="0.0001"
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
						className="my-2 w-full rounded-sm p-2 outline-none text-white border-none text-sm blue-glassmorphism"
					/>
					{isLoading ? (
						<Loader />
					) : (
						<button
							type="button"
							onClick={handleSubmit}
							className="text-white w-full mt-2 border-[1px] p-2 border-cyan-700 hover:bg-cyan-700 rounded-full cursor-pointer"
						>
							Play now
						</button>
					)}
					<div className="h-[1px] w-full bg-gray-400 my-10" />
					<h4>Ready to pick a winner?</h4>

					{isLoading ? (
						<Loader />
					) : (
						<button
							type="button"
							onClick={handlePickWinner}
							className="text-white w-full mt-2 border-[1px] p-2 border-lime-800 hover:bg-lime-800 rounded-full cursor-pointer"
						>
							Pick a winner!
						</button>
					)}
				</div>
			</div>
		</div>
	);
};
