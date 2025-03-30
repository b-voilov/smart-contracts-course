import { IDL, query, update, StableBTreeMap, time, } from 'azle';
import { Some, None } from 'azle/experimental';
const NoteIDL = IDL.Record({
    title: IDL.Text,
    content: IDL.Text,
})

type Note = {
    title: string,
    content: string,
}
const notes = new StableBTreeMap<bigint, Note>(0);
export default class {

    @query([], IDL.Vec(IDL.Tuple(IDL.Nat64, NoteIDL)))
    getNotes(): [bigint, Note][] {
        return notes.items();
    }

    @query([IDL.Nat64], IDL.Opt(IDL.Text))
    getNoteById(id: bigint): [string] | [] {
        const rec = notes.get(id)
        return rec ? [rec.title] : []
    }


    @update([NoteIDL], IDL.Nat64)
    addNote(note: Note): bigint {
        const id = time()
        notes.insert(id, note);
        return id;
    }

    @update([IDL.Nat64], IDL.Opt(NoteIDL))
    deleteNoteById(id: bigint): [Note] | [] {
        const note = notes.remove(id);
        return note ? [note] : []
    }
}
