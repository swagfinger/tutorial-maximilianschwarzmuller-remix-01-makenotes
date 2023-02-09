import { redirect, json } from '@remix-run/node';
import { useLoaderData, Link, useCatch } from '@remix-run/react';

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

  //CatchBoundary with throw - json({}) or new Response()
  if (!notes || notes.length === 0) {
    //thow 'not working' text or an object - goes to ErrorBoundary

    //throwing a response - caught by CatchBoundary()
    throw json(
      { message: 'Could not find any notes.' },
      { status: 404, statusText: 'not Found' }
    );
  }

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

//metadata
export function meta() {
  return {
    title: 'All notes',
    description: 'manage your notes with ease.',
  };
}

export function links() {
  return [...newNoteLinks(), ...noteListLinks()];
}

//this renders when an error is thrown
export function CatchBoundary() {
  //use useCatch() hook to catch errors thrown
  const caughtResponse = useCatch();
  const message = caughtResponse.data?.message || 'data not found';

  return (
    <main>
      <NewNote />

      <p className='info-message'>{message}</p>
    </main>
  );
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
