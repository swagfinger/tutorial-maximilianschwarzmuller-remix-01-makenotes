import { json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import styles from '~/styles/note-details.css';
import { getStoredNotes } from '../data/notes';

export default function NoteDetailsPage() {
  const note = useLoaderData();

  return (
    <main id='note-details'>
      <header>
        <nav>
          <Link to='/notes'>Back to all notes</Link>
        </nav>
        <h1>{note.title}</h1>
      </header>
      <p id='note-details-content'>{note.content}</p>
    </main>
  );
}

//metadata
//receives data object -> has property data - holds data returned by loader()
export function meta({ data, params }) {
  return {
    title: data.title,
    description: 'manage your notes with ease.',
  };
}

export function links() {
  return [{ rel: 'stylesheet', href: styles }];
}

// fetching data for dynamic routes -
//receives a data object passed in by remix automatically
//(with a 'request' property that has details get request and
//'params' property about route path
//in routes/ we have notes.$noteId.jsx

export async function loader({ params }) {
  const notes = await getStoredNotes();
  const noteId = params.noteId;
  const selectedNote = notes.find((node) => node.id === noteId);
  if (!selectedNote) {
    throw json({ message: 'could not find note for id' + noteId });
  }
  return selectedNote;
}
