import { createContext, ReactNode } from 'react';
import { useState } from 'react';

type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
}

type PlayerContextData = {
  episodeList: Episode[]; //necessary considering it's 
  // possible to jump to previous and next episodes in the player.
  currentEpisodeIndex: number;
  isPlaying: boolean;
  play: (episode: Episode) => void;
  togglePlay: () => void;
}

export const PlayerContext = createContext({} as PlayerContextData);
// basically declaring an interface saying that this context stores 
// a generic episodeList and some currentEpisodeIndex, even if not set.

type PlayerContextProviderProps = {
  children: ReactNode;
}

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setPlayingEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  function play(episode) {
    setEpisodeList([episode]);
    setPlayingEpisodeIndex(0);
    setIsPlaying(true);
  }

  function togglePlay() {
    setIsPlaying(!isPlaying);
  }

  return (
    <PlayerContext.Provider 
      value={{
        episodeList, 
        currentEpisodeIndex, 
        isPlaying, 
        play, 
        togglePlay
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}