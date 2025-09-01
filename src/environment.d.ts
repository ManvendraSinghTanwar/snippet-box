declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      NODE_ENV: string;
      OPENAI_API_KEY?: string;
    }
  }
}

export {};
