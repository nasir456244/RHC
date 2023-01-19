import Head from 'next/head'
import Image from 'next/image';
import Link from 'next/link';
import { sanityClient, urlFor } from '../sanity';

export default function Home({ collections }) {
  return (
    <div className='max-w-7xl mx-auto flex flex-col min-h-screen py-20 px-10 2xl:px-0'>
      <Head>
        <title>BC NFTs collection</title>
        <meta name="description" content="The Bidaar Club is a collection of 1000 unique BC NFTs— unique digital collectibles living on the Polygon blockchain. " />
      </Head>

      <h1 className='mb-10 text-4xl text-gray-200 font-extralight'>The {''}
        <span className='font-extrabold underline decoration-pink-400/50'>
          BC 
        </span> {''}
        NFT Market place
      </h1>
      <div className='bg-black p-10 shadow-xl shadow-rose-400/20'>
        <div className='grid space-x-3 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'>
          {collections?.map((collection) => (
            <Link key={collection?._id} href={`/nft/${collection.slug.current}`}>
              <div className='flex flex-col items-center cursor-pointer 
              transition-all duration-200 hover:scale-105'>
                <Image priority={true} height={384} width={240} className='rounded-2xl object-cover' src={urlFor(collection?.mainImage).url()} alt="mainImage" />   
                <div className='p-5'>
                  <h2 className='text-3xl text-gray-200'>{collection?.title}</h2>
                  <p className='mt-2 text-sm text-gray-400 '>{collection?.description}</p>
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
