import { useCallback } from 'react';

const useSound = (url = 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3') => {
  const play = useCallback(() => {
    const audio = new Audio(url);
    audio.play().catch(e => console.log('Interacción requerida para audio'));
  }, [url]);

  return { play };
};

export default useSound;