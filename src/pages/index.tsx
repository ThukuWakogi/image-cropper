import { Handler, useGesture } from "@use-gesture/react";
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
  const imageContainerRef = useRef<HTMLImageElement | null>(null);

  const adjustImage: Handler<
    "drag" | "pinch",
    PointerEvent | TouchEvent | MouseEvent | KeyboardEvent
  > = () => {
    const _imageRef = imageRef.current as HTMLImageElement;
    const _imageContainerRef = imageContainerRef.current as HTMLImageElement;

    let newCrop = { x, y, scale };
    let imageBounds = getImageBounds();
    let containerBounds = _imageContainerRef.getBoundingClientRect();
    let originalWidth = _imageRef.clientWidth;
    let widthOverhang = (imageBounds.width - originalWidth) / 2;
    let originalHeight = _imageRef.clientHeight;
    let heightOverhang = (imageBounds.height - originalHeight) / 2;

    if (imageBounds?.left > containerBounds?.left) newCrop.x = widthOverhang;
    else if (imageBounds.right < containerBounds.right)
      newCrop.x = -(imageBounds.width - containerBounds.width) + widthOverhang;

    if (imageBounds.top > containerBounds.top) newCrop.y = heightOverhang;
    else if (imageBounds.bottom < containerBounds.bottom)
      newCrop.y =
        -(imageBounds.height - containerBounds.height) + heightOverhang;

    setCrop(newCrop);
  };

  useGesture(
    {
      onDrag: ({ offset: [dx, dy] }) =>
        setCrop((previousState) => ({ ...previousState, x: dx, y: dy })),
      onPinch: ({
        memo,
        offset: [d],
        origin: [pinchOriginX, pinchOriginY],
      }) => {
        memo ??= { bounds: getImageBounds(), crop: { x, y, scale } };
        const factor = 1;
        let transformOriginX = memo.bounds.x + memo.bounds.width / 2;
        let transformOriginY = memo.bounds.y + memo.bounds.height / 2;
        let displacementX = (transformOriginX - pinchOriginX) / memo.crop.scale;
        let displacementY = (transformOriginY - pinchOriginY) / memo.crop.scale;
        let initialOffsetDistance = (memo.crop.scale - 1) * factor;
        let movementDistance = d - initialOffsetDistance;
        setCrop((previousState) => ({
          ...previousState,
          scale: d / factor,
          x: memo.crop.x + (displacementX * movementDistance) / factor,
          y: memo.crop.y + (displacementY * movementDistance) / factor,
        }));

        return memo;
      },
      onDragEnd: adjustImage,
      onPinchEnd: adjustImage,
    },
    {
      target: imageRef,
      eventOptions: { passive: false },
      drag: { from: () => [x, y] },
      pinch: { scaleBounds: { min: 1 } },
    }
  );

  const getImageBounds = () =>
    (imageRef.current as HTMLImageElement).getBoundingClientRect();

  return (
    <>
      <div className="overflow-hidden ring-4 ring-blue-500 aspect-[3/4]">
        <div ref={imageContainerRef} className="w-full h-full">
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
      </div>
      <div className="mt-2">
        <p>Crop X: {x}</p>
        <p>Crop Y: {y}</p>
        <p>Crop Scale: {scale}</p>
      </div>
    </>
  );
};
