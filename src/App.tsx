import React, { useState, useEffect } from 'react';
import { Participant } from './types';
import ParticipantCard from './components/ParticipantCard';
import { db } from './firebase';
import { ref, onValue, set, push, remove } from 'firebase/database';

const INITIAL_PARTICIPANTS: Omit<Participant, 'wishes'>[] = [
  { id: 'alice', name: 'Alice' },
  { id: 'lieselotte', name: 'Lieselotte' },
  { id: 'emile', name: 'Emile' },
  { id: 'katelijne', name: 'Katelijne' },
  { id: 'marine', name: 'Marine' },
  { id: 'geert', name: 'Geert' },
];

const App: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const participantsRef = ref(db, 'participants');
    
    const unsubscribe = onValue(participantsRef, 
      (snapshot) => {
        setError(null);
        const data = snapshot.val();
        if (data) {
          const participantsArray: Participant[] = Object.entries(data).map(([id, p]: [string, any]) => ({
            id,
            name: p.name,
            wishes: p.wishes ? Object.entries(p.wishes).map(([wishId, wish]: [string, any]) => ({ id: wishId, text: wish.text })) : []
          }));
          
          participantsArray.sort((a, b) => {
               const order = INITIAL_PARTICIPANTS.map(p => p.id);
               return order.indexOf(a.id) - order.indexOf(b.id);
          });
          setParticipants(participantsArray);
        } else {
          const initialData: { [key: string]: { name: string } } = {};
          INITIAL_PARTICIPANTS.forEach(p => {
            initialData[p.id] = { name: p.name };
          });
          set(participantsRef, initialData);
          setParticipants(INITIAL_PARTICIPANTS.map(p => ({...p, wishes: []})));
        }
        setLoading(false);
      }, 
      (error) => {
        console.error("Firebase read error:", error);
        setError("Oeps! Kon de wensenlijst niet ophalen. Controleer je internetverbinding en probeer de pagina te vernieuwen.");
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const addWish = (participantId: string, text: string) => {
    const participant = participants.find(p => p.id === participantId);
    if (participant && participant.wishes.length >= 5) {
      console.warn("Cannot add more than 5 wishes.");
      return;
    }
    const wishesRef = ref(db, `participants/${participantId}/wishes`);
    const newWishRef = push(wishesRef);
    set(newWishRef, { text });
  };

  const deleteWish = (participantId: string, wishId: string) => {
    const wishRef = ref(db, `participants/${participantId}/wishes/${wishId}`);
    remove(wishRef);
  };

  const updateWish = (participantId: string, wishId: string, text: string) => {
    const wishRef = ref(db, `participants/${participantId}/wishes/${wishId}/text`);
    set(wishRef, text);
  };

  if (loading) {
     return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-lg text-slate-500 dark:text-slate-400">Database laden...</p>
        </div>
     );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg relative text-center" role="alert">
          <strong className="font-bold">Oeps!</strong>
          <span className="block sm:inline ml-2">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 animate-fade-in">
      <header className="max-w-4xl mx-auto mb-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
          Wensenlijstje Kerst 2025
        </h1>
        <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
          Voeg voor elke deelnemer wensen toe, pas ze aan of verwijder ze.
        </p>
      </header>
      
      <main className="max-w-5xl mx-auto space-y-8">
        {participants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {participants.map(participant => (
              <ParticipantCard
                key={participant.id}
                participant={participant}
                onUpdateWish={updateWish}
                onAddWish={addWish}
                onDeleteWish={deleteWish}
              />
            ))}
          </div>
        ) : (
           <div className="text-center py-16 px-6 bg-white dark:bg-slate-800 rounded-lg shadow-md">
            <h3 className="mt-2 text-lg font-medium text-slate-900 dark:text-white">Geen deelnemers</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Bezig met laden van de deelnemerslijst...</p>
          </div>
        )}
      </main>
      
      <footer className="max-w-4xl mx-auto mt-12 text-center text-sm text-slate-500 dark:text-slate-400">
        <p>Gemaakt met React, Tailwind CSS & Firebase</p>
      </footer>
    </div>
  );
};

export default App;