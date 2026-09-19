import 'dotenv/config';

// Central, validated access to environment variables.
// Non-secret values get safe defaults; secrets are never given hardcoded fallbacks.
const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 4000,
  mongoUri: process.env.MONGODB_URI || '',
  jwtSecret: process.env.JWT_SECRET || '',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
};

export default env;