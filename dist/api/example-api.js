export async function exampleApiHandler(request) {
    const name = typeof request?.name === 'string' && request.name.trim().length > 0 ? request.name.trim() : 'friend';
    return {
        ok: true,
        message: `Hello, ${name}!`,
        received: { name }
    };
}
