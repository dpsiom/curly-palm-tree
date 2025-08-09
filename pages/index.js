import Head from 'next/head';
import KanbanBoard from '../components/KanbanBoard';

export default function Home() {
  return (
    <>
      <Head>
        <title>My Kanban Board</title>
      </Head>
      <main style={{ padding: '20px' }}>
        <h1 style={{ textAlign: 'center' }}>My Kanban Board</h1>
        <KanbanBoard />
      </main>
    </>
  );
}
