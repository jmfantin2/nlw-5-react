import {format, parseISO} from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/Link';

import { api } from '../../services/api';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

import styles from './episode.module.scss';

type Episode = {
  id: string;
  url: string;
  title: string;
  members: string;
  duration: number;
  thumbnail: string;
  publishedAt: string;
  durationAsString: string;
  description: string;
}

type EpisodeProps = {
  episode: Episode;
}

export default function Episode ({episode}: EpisodeProps) {
  return(
    <div className={styles.episode}>
      <div className={styles.thumbnailContainer}>
        <Link href='/'>
          <button type='button'>
            <img src="/arrow-left.svg" alt="Voltar" />
          </button>
        </Link>
        <Image 
          width={700} 
          height={320} 
          src={episode.thumbnail} 
          objectFit="cover"
        />
        <button type='button'>
          <img src="/play.svg" alt="Tocar episódio" />
        </button>
      </div>
      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationAsString}</span>
      </header>

      <div className={styles.description} dangerouslySetInnerHTML={{ __html: episode.description }} />
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const {ep} = ctx.params;
  const {data} = await api.get(`/episodes/${ep}`)
  const episode = {
      id: data.id,
      url: data.file.url,
      title: data.title,
      members: data.members,
      duration: Number(data.file.duration),
      thumbnail: data.thumbnail,
      description: data.description,
      publishedAt: format(parseISO(data.published_at),'d MMM yy',{locale: ptBR}),
      durationAsString: convertDurationToTimeString(Number(data.file.duration)),
  }
  return {
    props: {episode},
    revalidate: 60 * 60 * 24, //refreshes once in 24h
  }
}