import Head from 'next/head'
import Image from 'next/image';
import Link from 'next/link';
import { sanityClient, urlFor } from '../sanity';

export default function Home({ collections }) {
  return (
    <div className='max-w-7xl mx-auto flex flex-col min-h-screen py-20 px-10 2xl:px-0'>
      <Head>
        <title>Nft Drop</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className='mb-10 text-4xl font-extralight'>The {''}
                    <span className='font-extrabold underline decoration-pink-600/50'>
                        BIDAAR 
                    </span> {''}
                    NFT Market place
      </h1>
      <div className='bg-slate-100 p-10 shadow-xl shadow-rose-400/20'>
        <div className='grid space-x-3 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'>
          {collections?.map((collection) => (
            <Link key={collection?._id} href={`/nft/${collection.slug.current}`}>
              <div className='flex flex-col items-center cursor-pointer 
              transition-all duration-200 hover:scale-105'>
                <Image priority={true} height={384} width={240} className='rounded-2xl object-cover' src={urlFor(collection?.mainImage).url()} alt="mainImage" />   
                <div className='p-5'>
                  <h2 className='text-3xl'>{collection?.title}</h2>
                  <p className='mt-2 text-sm text-gray-400'>{collection?.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
    </div>
  )
}

const query = `*[_type == "collection"] {
  _id,
  title,
  address,
  description,
  nftCollectionName,
  mainImage {
    asset
  },
  previewImage {
    asset
  },
  slug {
    current
  },
  creator-> {
    _id,
    name,
    address,
    slug {
      current
    }
  },
}`;

export const getStaticProps = async () => {
 
  const collections = await sanityClient.fetch(query);


  return {
    props: {
      collections
    },
    revalidate: 10
  }
}