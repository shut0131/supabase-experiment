import React from 'react'
import { useState, useEffect, useCallback } from 'react'
import { Player } from '../../types'
import { RealtimeChannel } from '@supabase/supabase-js'


interface Props {
    players: Player[],
    isOwner: boolean,
    channel: RealtimeChannel
}
export function SelectAnswerPlayer({ players, isOwner, channel }: Props) {
    const [selectedPlayer, setSelectedPlayer] = useState<Player | undefined>(undefined)
    const [isRoulette, setIsRoulette] = useState(false)

    useEffect(() => {
        channel.on('broadcast', { event: 'random' }, ({ payload }) => {
            onRandom(payload.data)
        })
        channel.on('broadcast', { event: 'select' }, ({payload}) => {
            setSelectedPlayer(payload.data)
        })
    }, [])

    const onRandom = (player: Player) => {
        setIsRoulette(true)
        let counter = 0
        const interval = setInterval(() => {
            const tempPlayer = players[counter % players.length]
            setSelectedPlayer(tempPlayer)
            counter++
            if (counter > 20 && tempPlayer.id === player.id) {
                setSelectedPlayer(player)
                clearInterval(interval)
                setIsRoulette(false)
            }
        }, 100)
    }
    const startRoulette = useCallback(async () => {
        const player = players[Math.floor(Math.random() * players.length)]
        await channel.send({
            type: "broadcast",
            event: "random",
            payload: {
                data: player
            }
        })
        onRandom(player)
    }, [players.length])

    const selectPlayer = (player: Player) => {
        channel.send({
            type: "broadcast",
            event: "select",
            payload: {
                data: player
            }
        })
        setSelectedPlayer(player)
    }

    const startGame = () => {
        if (selectedPlayer !== undefined) {

        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                    プレイヤー選択
                </h1>
                <div className="grid grid-cols-3 gap-4 mb-8">
                    {players.map((player) => (
                        <button
                            key={player.id}
                            className={`btn transition-all duration-300 ease-in-out transform hover:scale-105 ${selectedPlayer?.id === player.id
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                            onClick={() => selectPlayer(player)}
                            disabled={isRoulette || !isOwner}
                        >
                            {player.name}
                        </button>
                    ))}
                </div>
                {isOwner ? (
                    <div className="flex justify-center space-x-4 mb-8">
                        <button
                            className="btn bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 ease-in-out transform hover:scale-105"
                            onClick={startRoulette}
                            disabled={isRoulette || !isOwner}
                        >
                            ランダム選択
                        </button>
                        <button
                            className={`btn transition-all duration-300 ease-in-out transform hover:scale-105 ${selectedPlayer == undefined
                                ? 'bg-gray-600 cursor-not-allowed'
                                : 'bg-green-600 hover:bg-green-700'
                                } text-white`}
                            onClick={startGame}
                            disabled={selectedPlayer == undefined || isRoulette || !isOwner}
                        >
                            決定
                        </button>
                    </div>
                )
                    : (<p className="text-center text-sm text-gray-400">ルームオーナーが選択中です</p>)}

            </div>
            <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        button:active {
          transform: scale(0.95);
        }
      `}</style>
        </div>
    )
}