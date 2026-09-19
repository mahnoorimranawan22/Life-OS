import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import AuthLayout from '../../components/auth/AuthLayout.jsx';

export default function Login() {
  const { login, status } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/home';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (status === 'authenticated') {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = {};
    if (!email.trim()) errors.email = 'Email is required.';
    if (!password) errors.password = 'Password is required.';
    setFieldErrors(errors);
    setApiError('');
    if (Object.keys(errors).length) return;

    setSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (error) {
      setApiError(error?.response?.data?.error || 'Unable to sign in. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your personal workspace."
      footer={
        <>
          New to LifeOS? <Link to="/register">Create an account</Link>.
        </>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {apiError && (
          <p className="auth-alert" role="alert">
            {apiError}
          </p>
        )}

        <Input
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          icon={Mail}
          placeholder="you@example.com"
          error={fieldErrors.email}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <Input
          label="Password"
          type="password"
          name="password"
          autoComplete="current-password"
          icon={Lock}
          placeholder="Your password"
          error={fieldErrors.password}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <Button type="submit" size="lg" loading={submitting} className="auth-submit">
          Sign in
        </Button>
      </form>
    </AuthLayout>
  );
}