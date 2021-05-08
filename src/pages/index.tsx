export default function Home(props) {
  console.log(props.episodes);

  return (
    <>
      <h1>index!</h1>
    </>
  );
}
/** getServerSideProps() 
 *  SSR magic stuff | \/ SSG alt
*/
export async function getStaticProps() {
  const response = await fetch('http://localhost:3333/episodes');
  const data = await response.json();

  return {
    props: {
      episodes: data,
    },
    revalidate: 60 * 60 * 8 //in seconds
    // generates a new version of the page every 8h
    // which means we now need a production build to effectively watch this happening
  }
}