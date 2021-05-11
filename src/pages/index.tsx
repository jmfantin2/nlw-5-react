import { GetStaticProps } from 'next';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR'

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
  description: string;
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
                <a href="">{episode.title}</a>
              </li>
            );
          })}
        </ul>
      </section>
      <section className={styles.allEpisodes}/>
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
      description: episode.description,
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