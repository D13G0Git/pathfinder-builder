import { useState } from 'react';
import { useSupabase } from '../contexts/SupabaseContext';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const { signIn, signUp } = useSupabase();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw error;
      } else {
        const { error } = await signUp(email, password);
        if (error) throw error;
        setMessage('¡Revisa tu correo electrónico para confirmar tu registro!');
      }
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleAuth} className="auth-form">
        <h1>{isLogin ? 'Iniciar Sesión' : 'Registrarse'}</h1>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Cargando...' : isLogin ? 'Iniciar Sesión' : 'Registrarse'}
        </button>
        <button 
          type="button" 
          className="switch-auth" 
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
        </button>
        {message && <div className="message">{message}</div>}
      </form>
      
      <style jsx>{`
        .auth-container {
          display: flex;
          justify-content: center;
          padding: 2rem 0;
        }
        .auth-form {
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
        button {
          width: 100%;
          padding: 0.75rem;
          border: none;
          border-radius: 4px;
          background-color: #3182ce;
          color: white;
          font-size: 1rem;
          cursor: pointer;
          margin-bottom: 1rem;
        }
        button:hover {
          background-color: #2c5282;
        }
        button:disabled {
          background-color: #a0aec0;
        }
        .switch-auth {
          background-color: transparent;
          color: #3182ce;
          text-decoration: underline;
        }
        .switch-auth:hover {
          background-color: transparent;
          color: #2c5282;
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