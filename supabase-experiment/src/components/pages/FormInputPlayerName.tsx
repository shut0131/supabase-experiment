import { useState } from 'react';

interface Props  {
    onSubmit :(playerName: string) => void
    isWaiting : boolean
}
export const FormInputPlayerName = ({onSubmit,isWaiting}:Props) => {
    const [playerName, setPlayerName] = useState('');
    
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <label htmlFor="player-name" className="mb-2">プレイヤー名</label>
            <input
                type="text"
                id="player-name"
                readOnly={isWaiting}
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="input input-bordered mb-2"
                onKeyDown={(e) => {e.key === 'Enter' && onSubmit(playerName)}}
            />
            <button
                type="button"
                className={`btn btn-primary`}
                disabled={!playerName.trim() || isWaiting}
                onClick={() => onSubmit(playerName)}
            >
                {isWaiting ? <span className="text-neutral-content loading loading-dots"></span> : '決定'}
            </button>
        </div>
    );
}