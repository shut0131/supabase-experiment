import type { RealtimeChannel } from "@supabase/supabase-js"
import { useMemo, useState } from "react"
import type { Player } from "../types"

interface Props {
	players: Player[]
	roomId: string
	isOwner: boolean
	channel: RealtimeChannel
	setStatusToStart: () => void
}

export function WaitingOtherMember({ players, roomId, isOwner, channel, setStatusToStart }: Props) {
	const [copySuccess, setCopySuccess] = useState(false)

	useMemo(() => {
		channel.on("broadcast", { event: "start" }, (_) => setStatusToStart())
	}, [channel.on, setStatusToStart])

	const inviteUrl = `${window.location.origin}?room_id=${roomId}`

	const copyInviteUrl = () => {
		navigator.clipboard
			.writeText(inviteUrl)
			.then(() => {
				setCopySuccess(true)
				setTimeout(() => setCopySuccess(false), 2000)
			})
			.catch((err) => console.error("コピーに失敗しました:", err))
	}

	const onStartGame = () => {
		channel.send({
			type: "broadcast",
			event: "start",
			payload: {
				messeage: "start",
			},
		})
		setStatusToStart()
	}

	return (
		<div className="container mx-auto p-4 w-3/4">
			<h1 className="text-2xl font-bold mb-4">参加状況</h1>

			<div className="grid grid-cols-3 gap-4 mb-6">
				{[...Array(9)].map((_, index) => {
					const participant = players[index]
					return (
						<div key={index} className={`p-4 rounded-lg shadow ${participant ? "bg-blue-100" : "bg-gray-100"}`}>
							{participant ? (
								<p className="text-gray-800">
									{participant.name}
									{participant.isOwner && <p className="text-sm text-gray-600">（ルームオーナー）</p>}
								</p>
							) : (
								<p>空席</p>
							)}
						</div>
					)
				})}
			</div>

			<div className="mb-6">
				<label htmlFor="invite-url" className="block text-sm font-medium text-gray-200 mb-2">
					招待URL
				</label>
				<div className="flex">
					<input
						id="invite-url"
						type="text"
						value={inviteUrl}
						readOnly
						className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
					<button
						onClick={copyInviteUrl}
						className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
						aria-label="招待URLをコピー"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5 inline-block mr-1"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
							<path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
						</svg>
						{copySuccess ? "コピーしました" : "コピー"}
					</button>
				</div>
			</div>

			{isOwner && (
				<div className="mb-6 flex justify-center">
					<button disabled={players.length < 2} onClick={onStartGame} className="w-1/2 btn btn-primary">
						ゲームを開始
					</button>
				</div>
			)}

			<p className="text-center text-gray-200">
				{isOwner
					? "プレイヤーが揃ったらスタートしてください"
					: "ルームオーナーがレクリエーションを開始するのをお待ちください"}
			</p>
		</div>
	)
}
