import { Scene } from '@/components';
// import gsap from 'gsap';
// import SplitText from "gsap/SplitText"
// import ScrollTrigger from "gsap/ScrollTrigger"
// import { useEffect, useRef } from 'react';

export default function Home() {
  // const titleRef = useRef<HTMLHeadingElement>(null);
  // const descriptionRef = useRef<HTMLHeadingElement>(null);
  // gsap.registerPlugin(SplitText);
  // gsap.registerPlugin(ScrollTrigger);

  // useEffect(() => {
  //   if (descriptionRef.current && descriptionRef.current) {
  //     const tl = gsap.timeline()
  //     const splitText = new SplitText(descriptionRef.current, {
  //       type: 'words'
  //     })
  //     tl.from(splitText.words, {
  //       y: 15,
  //       stagger: 0.1,
  //       filter: "blur(10px)",
  //       autoAlpha: 0,
  //     })

  //     tl.to(titleRef.current, {
  //       scale: 1.5,
  //       autoAlpha: 0,
  //       scrollTrigger: {
  //         scrub: 0.5,
  //         start: 'center center'
  //       }
  //     })

  //     // gsap.to(
  //     //   titleRef.current,
  //     //   { x: 15, y: 15, duration: 1.5 }
  //     // );
  //   }
  // }, []);

  return (
    <div className="flex flex-col h-full w-full">
      <main className="overflow-hidden h-full w-full">
        {/* <main className="h-full w-full">
        <h1 ref={titleRef} className='text-white fixed left-2/4 top-2/5 -translate-x-1/2 -translate-y-1/2 text-[12vw]'>NextBlock</h1>
        <h1 ref={descriptionRef} className='text-white text-6xl'>
          Discover the future of decentralized technology — one week at a time — with the newsletter that connects ideas, insights, and vision across the blockchain landscape.
        </h1> */}
        <Scene />
      </main>
      <footer className="w-full flex items-center justify-center border-t border-white py-4 text-gray-400">
        <a
          className="hover:underline hover:underline-offset-4"
          href="https://github.com/cpl121"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="hidden sm:inline">cpl121.eth</span>
        </a>
      </footer>
    </div>
  );
}
