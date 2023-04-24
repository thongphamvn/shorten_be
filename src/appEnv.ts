export type AppEnv = {
  mongoUri: string
  issuerBaseUrl: string
  audience: string
  port: number
  clientOriginUrl?: string
}

export const appEnv = (): AppEnv => {
  const config = {
    port: parseInt(process.env.PORT, 10) || 3000,
    mongoUri: process.env.MONGO_URI,
    issuerBaseUrl: process.env.ISSUER_BASE_URL,
    audience: process.env.AUDIENCE,
    clientOriginUrl: process.env.CLIENT_ORIGIN_URL || 'http://localhost:4200',
  }

  // check required env
  const requiredEnvVars: (keyof AppEnv)[] = [
    'audience',
    'issuerBaseUrl',
    'mongoUri',
  ]
  const notFoundVars = requiredEnvVars.filter((envVar) => !config[envVar])

  if (notFoundVars.length > 0) {
    throw Error(`Undefined environment variable: ${notFoundVars.join(', ')}`)
  }

  return config
}
