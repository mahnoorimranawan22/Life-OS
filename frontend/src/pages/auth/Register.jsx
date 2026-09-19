import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Lock, Mail, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import AuthLayout from '../../components/auth/AuthLayout.jsx';

export default function Register() {
  const { register, status } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (status === 'authenticated') {
    return <Navigate to="/home" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = {};
    if (!name.trim()) errors.name = 'Please enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errors.email = 'Enter a valid email address.';
    if (password.length < 8) errors.password = 'At least 8 characters.';
    setFieldErrors(errors);
    setApiError('');
    if (Object.keys(errors).length) return;

    setSubmitting(true);
    try {
      await register({ name: name.trim(), email: email.trim(), password });
      navigate('/home', { replace: true });
    } catch (error) {
      setApiError(error?.response?.data?.error || 'Unable to create your account. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create your workspace"
      subtitle="A calm place for your studies, projects and goals."
      footer={
        <>
          Already have an account? <Link to="/login">Sign in</Link>.
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
          label="Name"
          name="name"
          autoComplete="name"
          icon={User}
          placeholder="Ada Lovelace"
          error={fieldErrors.name}
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

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
          autoComplete="new-password"
          icon={Lock}
          placeholder="At least 8 characters"
          hint="Use at least 8 characters."
          error={fieldErrors.password}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <Button type="submit" size="lg" loading={submitting} className="auth-submit">
          Create workspace
        </Button>
      </form>
    </AuthLayout>
  );
}