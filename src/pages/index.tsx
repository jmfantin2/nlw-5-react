import { GetStaticProps } from 'next';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR'

import { api } from '../services/api';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  members: string;
  duration: number;
  durationAsString: string;
  url: string;
  publishedAr: string;
}

type HomeProps = {
  episodes: Episode[];
}

export default function Home(props: HomeProps) {
  return (
    <div>
      <h1>index!</h1>
      <p>{JSON.stringify(props.episodes)}</p>
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
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at),'d MMM yy',{locale: ptBR}),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      description: episode.description,
      url: episode.file.url
    };
  })

  /* Make the data available at your own terms */
  return {
    props: {
      episodes,
    },
    revalidate: 60 * 60 * 8 //in seconds
    // generates a new version of the page every 8 hours
    // which means we now need a production build to effectively watch this happening
  }

}