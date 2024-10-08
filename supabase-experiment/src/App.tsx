import { useState } from 'react'

import './App.css'
import { client } from "./supabse"
import { RealtimeChannel } from '@supabase/supabase-js'
import { Player } from './types'
import { FormInputPlayerName } from './components/FormInputPlayerName'
import { WaitingOtherMember } from './components/WaitingOtherMember'



function App() {

  const [roomId, setRoomId] = useState<string | undefined>(undefined)
  const [channel, setChannel] = useState<RealtimeChannel | undefined>(undefined)
  const [player, setPlayer] = useState<Player | undefined>(undefined)
  const [players, setPlayers] = useState<Player[]>([])

  const [status, setStatus] = useState<"inputPlayerName" | "joiningTheRoom" | "waitingOtherPlayers" >("inputPlayerName")

  const joinRoom = (playerName: string) => {
    setStatus("joiningTheRoom")
    const url = new URL(window.location.href)
    const roomIdFromParam = url.searchParams.get('room_id')
    const isHost = Boolean(roomIdFromParam)

    const roomId = roomIdFromParam || crypto.randomUUID()
    setRoomId(roomId)

    const roomOne = client.channel(roomId)
    setChannel(roomOne)

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
          // TODO: handle error
          return
        }

        const presenceTrackStatus = await roomOne.track({ data: player })
        if (presenceTrackStatus !== "ok") {
          // TODO: handle error
          console.error('Failed to track', presenceTrackStatus)
        }else{
          setStatus("waitingOtherPlayers")
        }
      })
  }

  if(status === "waitingOtherPlayers"){
    return (<WaitingOtherMember players={players} roomId={roomId!} isHost={player!.isHost} />)
  }

  if (status === "inputPlayerName" || "joiningTheRoom") {
    return (<FormInputPlayerName onSubmit={joinRoom} isWaiting={status === "joiningTheRoom"} />)
  }

  return (
    <>
      ???
    </>
  )
}

export default App
