import React from 'react';
import { Player } from '../types'

const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
}

interface Props {
    players: Player[]
    roomId: string
}

export const WaitingOtherMember = ({ players, roomId }: Props) => {
    const shareUrl = `${window.location.origin}?room_id=${roomId}`
    return (
        <div className="flex flex-col items-center justify-center">
            <h3 className="text-center">現在の参加状況</h3>
            <div>
                <table className="table w-full">
                    <tbody>
                        {Array.from({ length: 3 }, (_, rowIndex) => (
                            <tr key={rowIndex} className="hover:bg-neutral-focus">
                                <td className="text-center">
                                    <div className={`card ${players[rowIndex * 3] ? 'bg-blue-500' : 'bg-gray-300'} text-neutral-content`} >
                                        <div className="card-body">
                                            <div className="text-center">
                                                {players[rowIndex * 3] ? players[rowIndex * 3].name : '空席'}
                                                {players[rowIndex * 3]?.isOwner && <div className="text-sm">（ルームオーナー）</div>}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="text-center">
                                    <div className={`card ${players[rowIndex * 3 + 1] ? 'bg-blue-500' : 'bg-gray-300'} text-neutral-content`} >
                                        <div className="card-body">
                                            <p className="text-center">
                                                {players[rowIndex * 3 + 1] ? players[rowIndex * 3 + 1].name : '空席'}
                                                {players[rowIndex * 3 + 1]?.isOwner && <div className="text-sm">（ルームオーナー）</div>}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="text-center">
                                    <div className={`card ${players[rowIndex * 3 + 2] ? 'bg-blue-500' : 'bg-gray-300'} text-neutral-content`} >
                                        <div className="card-body">
                                            <p className="text-center">
                                                {players[rowIndex * 3 + 2] ? players[rowIndex * 3 + 2].name : '空席'}
                                                {players[rowIndex * 3 + 2]?.isOwner && <div className="text-sm">（ルームオーナー）</div>}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <label className="form-control w-full max-w-xs text-center mt-4">
                <div className="label">
                    <span className="label-text">このルームの招待URL</span>
                </div>
                <input readOnly type="text" value={shareUrl} className="input input-bordered w-full max-w-xs" />
                <button onClick={() => copyToClipboard(shareUrl)} className="mt-2">Copy</button>
            </label>
        </div>
    );
}
