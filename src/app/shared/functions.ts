export function getHost(): string {
  return 'https://swapi.dev/api';
}

export function getId(url: string): number {
  return +url?.split('/')[5];
}
