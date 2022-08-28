import { useGesture } from "@use-gesture/react";
import type { NextPage } from "next";
import { FC, useRef, useState } from "react";

const Home: NextPage = () => {
  return (
    <>
      <p className="mt-2 text-center"></p>
      <div className="p-8">
        <ImageCropper src="http://i3.ytimg.com/vi/bNDCFBIiAe8/maxresdefault.jpg" />
      </div>
    </>
  );
};

export default Home;

const ImageCropper: FC<{ src?: string }> = ({ src }) => {
  const [{ x, y, scale }, setCrop] = useState({ x: 0, y: 0, scale: 1 });
  const imageRef = useRef<HTMLImageElement | null>(null);

  useGesture(
    {
      onDrag: ({ offset: [dx, dy] }) =>
        setCrop((previousState) => ({ ...previousState, x: dx, y: dy })),
      onPinch: ({ offset: [d] }) =>
        setCrop((previousState) => ({ ...previousState, scale: d })),
    },
    { target: imageRef, eventOptions: { passive: false } }
  );

  return (
    <>
      <div className="overflow-hidden ring-4 ring-blue-500 aspect-[3/4]">
        <img
          src={src}
          ref={imageRef}
          className="relative w-auto h-full max-w-none max-h-none"
          style={{
            left: x,
            top: y,
            touchAction: "none",
            transform: `scale(${scale})`,
          }}
        />
      </div>
      <div className="mt-2">
        <p>Crop X: {x}</p>
        <p>Crop Y: {y}</p>
        <p>Crop Scale: {scale}</p>
      </div>
    </>
  );
};
