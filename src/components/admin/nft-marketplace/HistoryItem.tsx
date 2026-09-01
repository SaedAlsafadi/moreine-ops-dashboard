import Nft2 from '/public/img/nfts/Nft2.png';
import Nft1 from '/public/img/nfts/Nft1.png';
import Nft3 from '/public/img/nfts/Nft3.png';
import Nft4 from '/public/img/nfts/Nft4.png';
import Nft5 from '/public/img/nfts/Nft5.png';
import Nft6 from '/public/img/nfts/Nft6.png';
import Image from 'next/image';

import { FaEthereum } from 'react-icons/fa';
import Card from 'components/card';

const HistoryCard = () => {
  const HistoryData = [
    {
      image: Nft1,
      title: 'Colorful Heaven',
      owner: 'Mark Benjamin',
      price: 0.4,
      time: '30s',
    },
    {
      image: Nft2,
      title: 'Abstract Colors',
      owner: 'Esthera Jackson',
      price: 2.4,
      time: '50m',
    },
    {
      image: Nft3,
      title: 'ETH AI Brain',
      owner: 'Nick Wilson',
      price: 0.3,
      time: '20s',
    },
    {
      image: Nft4,
      title: 'Swipe Circles',
      owner: ' Peter Will',
      price: 0.4,
      time: '4h',
    },
    {
      image: Nft5,
      title: 'Mesh Gradients',
      owner: 'Will Smith',
      price: 0.4,
      time: '30s',
    },
    {
      image: Nft6,
      title: '3D Cubes Art',
      owner: ' Manny Gates',
      price: 0.4,
      time: '2m',
    },
  ];

  return (
    <Card extra={'mt-3 !z-5 overflow-hidden'}>
      {/* HistoryCard Header */}
      <div className="flex items-center justify-between rounded-t-3xl p-3">
        <div className="text-lg font-bold text-text-primary">
          History
        </div>
        <button className="linear rounded-[20px] bg-background px-4 py-2 text-base font-medium text-accent transition duration-200 hover:bg-gray-100 active:bg-border dark:bg-surface/5 dark:hover:bg-surface/10 dark:active:bg-surface/20">
          See all
        </button>
      </div>

      {/* History CardData */}

      {HistoryData.map((data, index) => (
        <div
          key={index}
          className="flex h-full w-full items-start justify-between bg-surface px-3 py-[20px] hover:shadow-2xl dark:hover:!bg-navy-700"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center">
              <Image
                width="2"
                height="20"
                className="h-full w-full rounded-xl"
                src={data.image}
                alt=""
              />
            </div>
            <div className="flex flex-col">
              <h5 className="text-base font-bold text-text-primary">
                {' '}
                {data.title}
              </h5>
              <p className="mt-1 text-sm font-normal text-text-secondary">
                {' '}
                {data.owner}{' '}
              </p>
            </div>
          </div>

          <div className="mt-1 flex items-center justify-center text-text-primary">
            <div>
              <FaEthereum />
            </div>
            <div className="ml-1 flex items-center text-sm font-bold text-text-primary">
              <p> {} </p>
              {data.price} <p className="ml-1">ETH</p>
            </div>
            <div className="ml-2 flex items-center text-sm font-normal text-text-secondary">
              <p>{data.time}</p>
              <p className="ml-1">ago</p>
            </div>
          </div>
        </div>
      ))}
    </Card>
  );
};

export default HistoryCard;
