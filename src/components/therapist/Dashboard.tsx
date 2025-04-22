import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useApi } from '@/hooks/useApi'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MoodChart } from '@/components/charts/MoodChart'
import { GoalList } from '@/components/goals/GoalList'
import { ConversationList } from '@/components/conversations/ConversationList'
import { NoteList } from '@/components/notes/NoteList'
import type { Client, MoodLog, Goal, Conversation, TherapistNote } from '@/types'

interface ClientData {
  client: Client
  moodLogs: MoodLog[]
  goals: Goal[]
  conversations: Conversation[]
  notes: TherapistNote[]
}

export function TherapistDashboard() {
  const { data: session } = useSession()
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [clients, setClients] = useState<Client[]>([])
  const [clientData, setClientData] = useState<ClientData | null>(null)
  const [newNote, setNewNote] = useState('')
  const [noteType, setNoteType] = useState<'private' | 'shared'>('private')

  const { data: therapistData, error: therapistError } = useApi('/api/therapist/me')
  const { data: clientsData, error: clientsError } = useApi('/api/therapist/clients')
  const { fetchData: fetchClientData } = useApi<ClientData>('/api/therapist/client-data')

  useEffect(() => {
    if (clientsData) {
      setClients(clientsData)
    }
  }, [clientsData])

  useEffect(() => {
    if (selectedClient) {
      fetchClientData({
        params: { clientId: selectedClient.id }
      }).then(data => {
        if (data) {
          setClientData(data)
        }
      })
    }
  }, [selectedClient, fetchClientData])

  const handleAddNote = async () => {
    if (!selectedClient || !newNote.trim()) return

    try {
      await fetch('/api/therapist/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId: selectedClient.id,
          content: newNote,
          isPrivate: noteType === 'private'
        }),
      })

      setNewNote('')
      // Refresh client data
      const updatedData = await fetchClientData({
        params: { clientId: selectedClient.id }
      })
      if (updatedData) {
        setClientData(updatedData)
      }
    } catch (error) {
      console.error('Error adding note:', error)
    }
  }

  if (therapistError || clientsError) {
    return <div>Error loading dashboard data</div>
  }

  if (!therapistData) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Client Selection */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {clients.map(client => (
                <Button
                  key={client.id}
                  variant={selectedClient?.id === client.id ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setSelectedClient(client)}
                >
                  {client.user.name || client.user.email}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Client Data */}
        <div className="md:col-span-3 space-y-4">
          {selectedClient ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Mood History</CardTitle>
                </CardHeader>
                <CardContent>
                  <MoodChart data={clientData?.moodLogs || []} />
                </CardContent>
              </Card>

              <Tabs defaultValue="goals">
                <TabsList>
                  <TabsTrigger value="goals">Goals</TabsTrigger>
                  <TabsTrigger value="conversations">Conversations</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                </TabsList>

                <TabsContent value="goals">
                  <GoalList goals={clientData?.goals || []} />
                </TabsContent>

                <TabsContent value="conversations">
                  <ConversationList conversations={clientData?.conversations || []} />
                </TabsContent>

                <TabsContent value="notes">
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Add a note..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                      />
                      <Select value={noteType} onValueChange={(value: 'private' | 'shared') => setNoteType(value)}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Note type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="private">Private Note</SelectItem>
                          <SelectItem value="shared">Shared Note</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button onClick={handleAddNote}>Add Note</Button>
                    </div>
                    <NoteList notes={clientData?.notes || []} />
                  </div>
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Select a client to view their data</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
} 