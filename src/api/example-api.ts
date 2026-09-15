export interface ExampleApiRequest {
  name?: string;
}

export async function exampleApiHandler(request: ExampleApiRequest): Promise<Record<string, unknown>> {
  const name = typeof request?.name === 'string' && request.name.trim().length > 0 ? request.name.trim() : 'friend';

  return {
    ok: true,
    message: `Hello, ${name}!`,
    received: { name }
  };
}
