import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Slider from 'rc-slider';

import { usePlayer } from '../../contexts/PlayerContext';

import 'rc-slider/assets/index.css';
import styles from './styles.module.scss';

function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);

  const {
    episodeList, 
    currentEpisodeIndex, 
    isPlaying,
    isLooping,
    isShuffling,
    togglePlay,
    toggleLoop,
    toggleShuffle,
    playNext,
    playPrevious
  } = usePlayer();

  useEffect(() => {
    if(audioRef.current){
      if(isPlaying){
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying])

  const episode = episodeList[currentEpisodeIndex]

  return(
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Tocando agora"/>
        <strong>{episode ? '' : 'Nada tocando no momento'}</strong>
      </header>

      {
        episode 
        ? (
          <div className={styles.playingEpisode}>
            <Image width={592} height={592} src={episode.thumbnail} objectFit="cover"/>
            <strong>{episode.title}</strong>
            <span>{episode.members}</span>
          </div>
        )
        : (
          <div className={styles.emptyPlayer}>
            <strong>Selecione um podcast para ouvir</strong>
          </div>
        )
      }

      <footer className={episode ? '' : styles.empty}>
        <div className={styles.progress}>
          <span>00:00</span>
          <div className={styles.slider}>
            { 
              episode 
              ? (<Slider
                  trackStyle={{backgroundColor: '#04d361'}}
                  railStyle={{backgroundColor: '#9f75ff'}}
                  handleStyle={{borderColor: '#04d361', borderWidth: 2}}
                />) 
              : (<div className={styles.emptySlider}/>)
            }
          </div>
          <span>00:00</span>
        </div>

        { episode && (
          <audio
            src={episode.url}
            ref={audioRef}
            loop={isLooping}
            autoPlay
          />
        )}

        <div className={styles.buttons}>
          <button 
            type='button' 
            disabled={!episode} 
            onClick={toggleShuffle}
            className={isShuffling ? styles.isActive : ''}>
            <img src="/shuffle.svg" alt="Aleatório"/>
          </button>
          <button type='button' disabled={!episode} onClick={playPrevious}>
            <img src="/play-previous.svg" alt="Anterior"/>
          </button>
          <button 
            type='button' 
            disabled={!episode} 
            className={styles.playButton} 
            onClick={togglePlay}>
            <img src={isPlaying ? "/pause.svg": "/play.svg"} alt="Tocar/Pausar"/>
          </button>
          <button type='button' disabled={!episode} onClick={playNext}>
            <img src="/play-next.svg" alt="Próximo"/>
          </button>
          <button 
            type='button' 
            disabled={!episode} 
            onClick={toggleLoop}
            className={isLooping ? styles.isActive : ''}
          >
            <img src="/repeat.svg" alt="Repetir"/>
          </button>
        </div>
      </footer>
    </div>
  );
}

export { Player }