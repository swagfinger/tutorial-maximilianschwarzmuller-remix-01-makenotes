import { redirect, json } from '@remix-run/node';
import { useLoaderData, Link } from '@remix-run/react';

import NewNote, { links as newNoteLinks } from '~/components/NewNote';
import NoteList, { links as noteListLinks } from '~/components/NoteList';

import { getStoredNotes, storeNotes } from '../data/notes';

export default function NotesPage() {
  // STEP3
  const notes = useLoaderData(); //hook gives us data from loader()
  return (
    <main>
      <NewNote />
      <NoteList notes={notes} />
    </main>
  );
}

//STEP2
//runs on backend - triggers when with GET request eg. when page loads
export async function loader() {
  const notes = await getStoredNotes();
  return json(notes); //serialized obj: no functions
}

//STEP1
//runs on backend - triggers when non-GET request is called. like a POST
//receives data object - with 'request' object with details about request submitted by form.
export async function action({ request }) {
  const formData = await request.formData(); //gets data from form submit
  const nodeData = Object.fromEntries(formData);

  //validation - can send data out to be picked up by useActionData() hook.
  if (nodeData.title.trim().length < 5) {
    return { message: 'invalid title - must be atleast 5 chars long' };
  }

  const existingNotes = await getStoredNotes();
  nodeData.id = new Date().toISOString();
  const updatedNotes = existingNotes.concat(nodeData);

  await storeNotes(updatedNotes);

  // testing button loading state in NewNote
  await new Promise((resolve, reject) => setTimeout(() => resolve(), 2000));
  return redirect('/notes');
}

export function links() {
  return [...newNoteLinks(), ...noteListLinks()];
}

export function ErrorBoundary({ error }) {
  return (
    <main className='error'>
      <h1>Notes has an error</h1>
      <p>{error.message}</p>
      <p>
        Back to <Link to='/'>safety</Link>!
      </p>
    </main>
  );
}
