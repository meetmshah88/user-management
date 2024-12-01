import React, { useEffect, useState } from "react";

const API_CALLS = Array.from({ length: 20 }).map((_, index) => index + 1);

let timer: any = null;
const generateAsync = (promo: number) => {
  return new Promise((resolve, reject) => {
    timer = setTimeout(() => {
      resolve(`I am resolved promise of ${promo}`);
    }, promo * 1000);
  });
};

const chop = (arr: Promise<Number>[], size = 5) => {
  let index = 0;

  let output = [];

  while (index < arr.length) {
    let slicedArr = arr.slice(index, index + size);
    output.push(slicedArr);
    index = index + size;
  }

  return output;
};

const wait = async (time: number) => {
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("");
    }, time);
  });
};

const generatedPromises = API_CALLS.map((el) =>
  generateAsync(el)
) as unknown as Promise<Number>[];

export const BatchComp = () => {
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<any>([]);

  const choppedPromises = chop(generatedPromises, 5);

  const callFirstBatchOfAPIs = async (pindex: number) => {
    try {
      //await wait(5000);
      const resp = await Promise.all(choppedPromises[pindex]);
      setResults((prev: any) => [...prev, ...resp]);
      console.log(resp);
    } catch (error) {
      console.log(error);
    } finally {
      setIndex(index < choppedPromises.length - 1 ? index + 1 : 0);
    }
  };

  useEffect(() => {
    if (index === 0) {
      setTimeout(() => {
        callFirstBatchOfAPIs(index);
      }, 5000);
    } else {
      callFirstBatchOfAPIs(index);
    }
  }, [index]);

  return (
    <div>
      <div>
        {results.map((el: any, index: number) => {
          return <div key={index}>{el}</div>;
        })}
      </div>
    </div>
  );
};
