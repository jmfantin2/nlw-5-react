import { GetStaticProps } from 'next';
import Image from 'next/image'
import Link from 'next/link'

import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { api } from '../services/api';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';

import styles from './home.module.scss';

type Episode = {
  id: string;
  url: string;
  title: string;
  members: string;
  duration: number;
  thumbnail: string;
  publishedAt: string;
  durationAsString: string;
}

type HomeProps = {
  latestEpisodes: Episode[];
  allEpisodes: Episode[];
}

export default function Home({latestEpisodes, allEpisodes}: HomeProps) {
  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>
        <ul>
          {latestEpisodes.map(episode => {
            return (
              <li key={episode.id}> 
                {/* key is useful for additions and deletions*/}
                <Image 
                  width={192} 
                  height={192} 
                  src={episode.thumbnail} 
                  alt={episode.title}
                  objectFit='cover'
                />
                <div className={styles.episodeDetails}>
                  <Link href={`/episodes/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>
                <button type="button">
                  <img src="/play-green.svg" alt="Tocar episódio"/>
                </button>
              </li>
            );
          })}
        </ul>
      </section>
      <section className={styles.allEpisodes}>
        <h2>Todos episódios</h2>
        <table cellSpacing={0}>
          <thead>
            <th></th>
            <th>Podcast</th>
            <th>Integrantes</th>
            <th>Data</th>
            <th>Duração</th>
            <th></th>
          </thead>
          <tbody>
            {allEpisodes.map(episode => {
              return(
                <tr key={episode.id}>
                  <td style={{width: 72}}>
                    <Image
                      width={120}
                      height={120}
                      src={episode.thumbnail}
                      alt={episode.title}
                      objectFit="cover"
                    />
                  </td>
                  <td>
                    <Link href={`/episodes/${episode.id}`}>
                      <a>{episode.title}</a>
                    </Link>
                  </td>
                  <td>{episode.members}</td>
                  <td style={{width: 100}}>{episode.publishedAt}</td>
                  <td>{episode.durationAsString}</td>
                  <td>
                    <button type="button">
                      <img src="/play-green.svg" alt="Tocar episódio" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}
/** getServerSideProps() 
 *  ↪ SSR magic stuff | ↓ SSG alt
*/
export const getStaticProps: GetStaticProps = async () => {
  /* Get the data */
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12, //for the 2 most recent + 10 for the list
      _sort: 'published_at', //by time published
      _order: 'desc' // most recent ones first
    }
  });

  /* Format the data */
  const episodes = data.map(episode => {
    return { 
      id: episode.id,
      url: episode.file.url,
      title: episode.title,
      members: episode.members,
      duration: Number(episode.file.duration),
      thumbnail: episode.thumbnail,
      publishedAt: format(parseISO(episode.published_at),'d MMM yy',{locale: ptBR}),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
    };
  })

  const latestEpisodes = episodes.slice(0,2);
  const allEpisodes = episodes.slice(2, episodes.length);

  /* Make the data available at your own terms */
  return {
    props: {
      latestEpisodes,
      allEpisodes
    },
    revalidate: 60 * 60 * 8 //in seconds
    // generates a new version of the page every 8 hours
    // which means we now need a production build to effectively watch this happening
  }

}