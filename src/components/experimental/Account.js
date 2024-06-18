import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { useSession } from "../useSession"
import { Box, Button, Form, FormField, TextInput } from "grommet"
import Avy from './Avy'

export default function Account() {
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState(null)
  const [website, setWebsite] = useState(null)
  const [avatar_url, setAvatarUrl] = useState(null)
  const { session } = useSession()

  useEffect(() => {
    if (!session) return;

    let ignore = false

    async function getProfile() {
      setLoading(true)
      const { user } = session

      const { data, error } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', user.id)
        .single()

      if (!ignore) {
        if (error) {
          console.warn(error)
        } else if (data) {
          setUsername(data.username)
          setWebsite(data.website)
          setAvatarUrl(data.avatar_url)
        }
      }

      setLoading(false)
    }

    getProfile()

    return () => {
      ignore = true
    }
  }, [session])

  async function updateProfile(event, avatarUrl) {
    event.preventDefault()

    setLoading(true)
    const { user } = session

    const updates = {
      id: user.id,
      username,
      website,
      avatar_url: avatarUrl,
      updated_at: new Date(),
    }

    const { error } = await supabase.from('profiles').upsert(updates)

    if (error) {
      alert(error.message)
    } else {
      setAvatarUrl(avatarUrl)
    }
    setLoading(false)
  }

  if (!session) {
    return <div>Loading...</div>;
  }

  return (
    <Box>
        <Form onSubmit={updateProfile} >
            <FormField htmlFor="email" name="email" label="email" disabled>
                <TextInput id="email" name="text" value={session.user.email} disabled />
            </FormField>
            <FormField htmlFor="username" name="username" label="username" required>
                <TextInput
                id="username"
                value={username || ''}
                onChange={(e) => setUsername(e.target.value)}
                />
            </FormField>
            <FormField htmlFor="website" name="website" label="website">
                <TextInput
                id="website"
                value={website || ''}
                onChange={(e) => setWebsite(e.target.value)}
                />
            </FormField>

            <Avy
            url={avatar_url}
            size={150}
            onUpload={(event, url) => {
                updateProfile(event, url)
            }}
            />

            <Box>
                <Button type="submit" disabled={loading}>
                {loading ? 'Loading ...' : 'Update'}
                </Button>
            </Box>
        </Form>
    </Box>
  )
}