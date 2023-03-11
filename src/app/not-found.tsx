import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404',
  description: 'not found!.',
  icons: {
    shortcut: '/logo.svg',
  },
}
export default function NotFound() {
    return (
      <>
        <h2>Not Found</h2>
        <p>Could not find requested poll</p>
      </>
    );
  }