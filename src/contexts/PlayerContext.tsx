import { createContext, ReactNode, useContext } from 'react';
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
  isLooping: boolean;
  isShuffling: boolean;
  play: (episode: Episode) => void;
  playFromList: (episodes: Episode[], index: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  togglePlay: () => void;
  toggleLoop: () => void;
  toggleShuffle: () => void;
}

export const PlayerContext = createContext({} as PlayerContextData);
// basically declaring an interface saying that this context stores 
// a generic episodeList and some currentEpisodeIndex, even if not set.

type PlayerContextProviderProps = {
  children: ReactNode;
}

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  function play(episode) {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function playFromList(episodes: Episode[], index: number) {
    //index serves to know what are the previous and next episodes 
    setEpisodeList(episodes);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }

  function toggleLoop() {
    setIsLooping(!isLooping);
  }

  function toggleShuffle() {
    setIsShuffling(!isShuffling);
  }

  function togglePlay() {
    setIsPlaying(!isPlaying);
  }

  function playPrevious() { // former playNext
    if(currentEpisodeIndex === episodeList.length-1) {
      // is last of the list? goes to first of the list 
      setCurrentEpisodeIndex(0);
    } else {
      // is in any other position? goes to actual next 
      setCurrentEpisodeIndex(currentEpisodeIndex+1);
    }
  }
  
  /* i inverted their former functionalities so it works 
  top-down, from oldest to newest, kinda like spotify :) */

  function playNext() { // former playPrevious
    if (isShuffling) {
      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);
      setCurrentEpisodeIndex(nextRandomEpisodeIndex);
    } else {
      if(currentEpisodeIndex === 0) {
        // is first of the list? goes to last of the list 
        setCurrentEpisodeIndex(episodeList.length-1);
      } else {
        // is in any other position? goes to actual previous 
        setCurrentEpisodeIndex(currentEpisodeIndex-1);
      }
    }
  }

  return (
    <PlayerContext.Provider 
      value={{
        episodeList, 
        currentEpisodeIndex, 
        isPlaying, 
        isLooping,
        isShuffling,
        play, 
        playFromList,
        playNext,
        playPrevious,
        togglePlay,
        toggleLoop,
        toggleShuffle
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => {
  return useContext(PlayerContext);
}