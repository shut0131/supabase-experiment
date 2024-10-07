import { useEffect, useState } from 'react'

import './App.css'
import { client } from "./supabse"
import { RealtimeChannel } from '@supabase/supabase-js'
import { Player } from './types'

let initilized = false

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
}

function App() {

  const [roomId, setRoomId] = useState<string | undefined>(undefined)
  const [channel, setChannel] = useState<RealtimeChannel | undefined>(undefined)
  const [player, setPlayer] = useState<Player | undefined>(undefined)
  const [players, setPlayers] = useState<Player[]>([])

  const [initializeStatus, setInitializeStatus] = useState<"initializing" | "failed" | "ok">("initializing")

  useEffect(() => {
    if (channel || initilized) return

    initilized = true

    const url = new URL(window.location.href)
    const roomIdFromParam = url.searchParams.get('room_id')
    const isHost = Boolean(roomIdFromParam)

    const roomId = roomIdFromParam || crypto.randomUUID()
    setRoomId(roomId)

    const roomOne = client.channel(roomId)
    setChannel(roomOne)


    let playerName = window.prompt('プレイヤー名を入力してください')
    while (!playerName || !playerName.trim()) {
      playerName = window.prompt('プレイヤー名は必須です')
    }
    const player = { id: crypto.randomUUID(), name: playerName, isHost }
    setPlayer(player)

    roomOne
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        const joinedPlayer = newPresences.map((presence) => presence.data)
        setPlayers((prevPlayers) => [...prevPlayers, ...joinedPlayer])
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        setPlayers((prevPlayers) => prevPlayers.filter((player) => !leftPresences.some((presence) => presence.data.id === player.id)))
      })
      .subscribe(async (status) => {
        if (status !== 'SUBSCRIBED') {
          console.error('Failed to subscribe', status)
          return
        }

        const presenceTrackStatus = await roomOne.track({ data: player })
        if (presenceTrackStatus !== "ok") {
          console.error('Failed to track', presenceTrackStatus)

        }
      })



  }, [])


  if(initializeStatus === "initializing"){
    return <span className="loading loading-dots loading-lg"></span>
  }
  
  return (
    <>
     <h1 className="text-3xl font-bold underline">Hello World</h1>
      <p>{`${window.location.origin}?room_id=${roomId}`}<button onClick={() => copyToClipboard(`${window.location.origin}?room_id=${roomId}`)}>Copy</button></p>
      <h3>参加中のプレイヤー</h3>
      {players.map((player) => (
        <p key={player.id}>{player.name}</p>
      ))}
    </>
  )
}

export default App
