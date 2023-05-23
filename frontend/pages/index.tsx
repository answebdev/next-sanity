import Link from 'next/link';
import groq from 'groq';
import client from '../client';
import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

function urlFor(source: SanityImageSource) {
  return imageUrlBuilder(client).image(source);
}

const Index = ({ posts }) => {
  return (
    <div>
      <h1>Welcome to my blog!</h1>
      {posts.length > 0 &&
        posts.map(
          ({ _id, title = '', slug = '', publishedAt = '', mainImage = '' }) =>
            slug && (
              // eslint-disable-next-line react/jsx-key
              <div style={{ marginBottom: '40px' }}>
                <li key={_id}>
                  <Link href={`/post/${encodeURIComponent(slug.current)}`}>
                    {title}
                  </Link>{' '}
                  ({new Date(publishedAt).toDateString()})
                </li>
                <br />
                <img
                  src={urlFor(mainImage).width(300).url()}
                  alt={`${mainImage}`}
                />
              </div>
            )
        )}
    </div>
  );
};

export async function getStaticProps() {
  const posts = await client.fetch(groq`
      *[_type == "post" && publishedAt < now()] | order(publishedAt desc)
    `);
  return {
    props: {
      posts,
    },
  };
}

export default Index;
