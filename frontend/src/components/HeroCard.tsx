import React from 'react';
import { CardBody, CardContainer, CardItem } from "./ui/3d-card";

const HeroCard: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-800 py-20">
      <CardContainer className="inter-var">
        <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-purple-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[50rem] h-auto rounded-xl p-6 border">
          <CardItem
            translateZ="50"
            className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-purple-600 to-indigo-600"
          >
            EVOLUTION GADGET
          </CardItem>
          <CardItem
            as="p"
            translateZ="60"
            className="text-gray-500 text-xl max-w-sm mt-2 dark:text-neutral-300"
          >
            Premium Tech Made Simple
          </CardItem>
          <CardItem
            translateZ="100"
            rotateX={20}
            rotateZ={-10}
            className="w-full mt-4"
          >
            <img
              src="/img/cover.png"
              height="1000"
              width="1000"
              className="h-80 w-full object-cover rounded-xl group-hover/card:shadow-xl"
              alt="Evolution Gadget"
            />
          </CardItem>
          
          <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
            <CardItem
              translateZ={20}
              className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-sm font-bold hover:bg-purple-600 transition"
            >
              ✓ Authorized Retailer
            </CardItem>
            <CardItem
              translateZ={20}
              className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-sm font-bold hover:bg-purple-600 transition"
            >
              ✓ Cash on Delivery
            </CardItem>
            <CardItem
              translateZ={20}
              className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-sm font-bold hover:bg-purple-600 transition"
            >
              ✓ 3-Day Warranty
            </CardItem>
          </div>

          <div className="flex justify-center items-center mt-10">
            <CardItem
              translateZ={20}
              as="button"
              className="px-8 py-3 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white text-lg font-bold hover:from-purple-700 hover:to-indigo-700 transition shadow-lg"
            >
              Explore Products →
            </CardItem>
          </div>
        </CardBody>
      </CardContainer>
    </div>
  );
};

export default HeroCard;
