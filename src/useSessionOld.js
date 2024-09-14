import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { supaClient } from './supabaseClient';
import { sessionState, profileState } from './atoms/state'; // Import Recoil atoms

const AuthContext = createContext();

export function useSession() {
  const setSession = useSetRecoilState(sessionState);
  const setProfile = useSetRecoilState(profileState);
  const session = useRecoilValue(sessionState); // Get session from Recoil
  const profile = useRecoilValue(profileState); // Get profile from Recoil
  const [channel, setChannel] = useState(null);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { error } = await supaClient.auth.signOut();

    if (error) {
      console.log(error);
    }
    navigate('/');
  };

  useEffect(() => {
    supaClient.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supaClient.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setProfile(null);
    });
  }, []);

  useEffect(() => {
    if (session?.user && !profile) {
      listenToUserProfileChanges(session.user.id).then((newChannel) => {
        if (newChannel) {
          if (channel) {
            channel.unsubscribe();
          }
          setChannel(newChannel);
        }
      });
    } else if (!session?.user) {
      channel?.unsubscribe();
      setChannel(null);
    }
  }, [session]);

  async function listenToUserProfileChanges(userId) {
    const { data } = await supaClient
      .from('user_profiles')
      .select('*')
      .filter('user_id', 'eq', userId);
    if (!data?.length) {
      console.log('No profile found, redirecting to welcome page.');
      navigate('/welcome');
    } else {
      console.log('Profile found:', data[0]);
      setProfile(data[0]); // Set the profile in Recoil state
    }

    return supaClient
      .channel(`public: user_profiles`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_profiles',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setProfile(payload.new);
        }
      )
      .subscribe();
  }

  return {
    handleSignOut,
  };
}

export function AuthProvider({ children }) {
  const { handleSignOut } = useSession();

  return (
    <AuthContext.Provider value={{ handleSignOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export default function AuthConsumer() {
  return useContext(AuthContext);
}
