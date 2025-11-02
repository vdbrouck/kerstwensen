import React, { useState } from 'react';
import { Participant } from '../types';

interface ParticipantCardProps {
  participant: Participant;
  onUpdateWish: (participantId: string, wishId: string, text: string) => void;
  onAddWish: (participantId: string, text: string) => void;
  onDeleteWish: (participantId: string, wishId: string) => void;
}

const ParticipantCard: React.FC<ParticipantCardProps> = ({ participant, onUpdateWish, onAddWish, onDeleteWish }) => {
  const [newWishText, setNewWishText] = useState('');
  const MAX_WISHES = 5;
  const canAddMoreWishes = participant.wishes.length < MAX_WISHES;

  const handleAddWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (newWishText.trim() && canAddMoreWishes) {
      onAddWish(participant.id, newWishText.trim());
      setNewWishText('');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 flex flex-col h-full transition-all duration-300 hover:shadow-xl">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{participant.name}</h3>
      </div>
      <div className="space-y-3 flex-grow">
        {participant.wishes.map((wish, index) => (
          <div key={wish.id} className="flex items-center gap-2">
            <span className="text-slate-500 dark:text-slate-400 font-semibold">{index + 1}.</span>
            <input
              type="text"
              value={wish.text}
              onChange={(e) => onUpdateWish(participant.id, wish.id, e.target.value)}
              placeholder={`Wens ${index + 1}`}
              className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
            <button
              onClick={() => onDeleteWish(participant.id, wish.id)}
              className="p-2 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-red-500"
              aria-label={`Verwijder wens`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ))}
        {participant.wishes.length === 0 && (
          <p className="text-slate-500 dark:text-slate-400 text-center italic py-4">Nog geen wensen toegevoegd.</p>
        )}
      </div>
      <form onSubmit={handleAddWish} className="mt-6 flex gap-3">
         <input
          type="text"
          value={newWishText}
          onChange={(e) => setNewWishText(e.target.value)}
          placeholder={canAddMoreWishes ? "Nieuwe wens" : `Maximum ${MAX_WISHES} wensen`}
          className="flex-grow px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:cursor-not-allowed"
          disabled={!canAddMoreWishes}
          aria-disabled={!canAddMoreWishes}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-900 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!newWishText.trim() || !canAddMoreWishes}
        >
          Voeg toe
        </button>
      </form>
    </div>
  );
};

export default ParticipantCard;
