import { useState, useEffect } from 'react';
import { useSupabase } from '../contexts/SupabaseContext';
import { supabase } from '../utils/supabase';

interface ProfileData {
  username: string;
  website: string;
  avatar_url: string;
}

export default function Profile() {
  const { user, signOut } = useSupabase();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [username, setUsername] = useState('');
  const [website, setWebsite] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        
        if (!user) return;

        const { data, error } = await supabase
          .from('profiles')
          .select('username, website, avatar_url')
          .eq('id', user.id)
          .single();

        if (error) {
          console.warn(error);
        } else if (data) {
          setProfile(data);
          setUsername(data.username || '');
          setWebsite(data.website || '');
        }
      } catch (error) {
        console.error('Error cargando datos de perfil', error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user]);

  async function updateProfile(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      setLoading(true);
      setMessage(null);
      
      if (!user) return;

      const updates = {
        id: user.id,
        username,
        website,
        updated_at: new Date(),
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(updates, { returning: 'minimal' });

      if (error) throw error;
      setMessage('Perfil actualizado correctamente');
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="profile-container">
      <div className="profile-form-wrapper">
        <h1>Perfil</h1>
        <p>Email: {user?.email}</p>
        
        <form onSubmit={updateProfile} className="profile-form">
          <div className="form-group">
            <label htmlFor="username">Nombre de usuario</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="website">Sitio web</label>
            <input
              id="website"
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>
          
          <button
            type="submit"
            className="button primary-button"
            disabled={loading}
          >
            {loading ? 'Cargando...' : 'Actualizar perfil'}
          </button>
        </form>
        
        <button
          type="button"
          className="button signout-button"
          onClick={signOut}
        >
          Cerrar sesión
        </button>
        
        {message && <div className="message">{message}</div>}
      </div>
      
      <style jsx>{`
        .profile-container {
          display: flex;
          justify-content: center;
          padding: 2rem 0;
        }
        .profile-form-wrapper {
          width: 100%;
          max-width: 420px;
          padding: 2rem;
          border-radius: 10px;
          box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
        }
        h1 {
          margin-top: 0;
          text-align: center;
        }
        .form-group {
          margin-bottom: 1.5rem;
        }
        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
        }
        .button {
          width: 100%;
          padding: 0.75rem;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          margin-bottom: 1rem;
        }
        .primary-button {
          background-color: #3182ce;
          color: white;
        }
        .primary-button:hover {
          background-color: #2c5282;
        }
        .primary-button:disabled {
          background-color: #a0aec0;
        }
        .signout-button {
          background-color: #f56565;
          color: white;
        }
        .signout-button:hover {
          background-color: #c53030;
        }
        .message {
          margin-top: 1rem;
          padding: 0.75rem;
          border-radius: 4px;
          background-color: #e6fffa;
          color: #234e52;
          text-align: center;
        }
      `}</style>
    </div>
  );
} 