import React, { useState, useEffect, useRef } from "react";

const images = [
  {
    link: "https://img.freepik.com/free-photo/colorful-design-with-spiral-design_188544-9588.jpg",
    width: "500px",
    height: "500px",
  },

  {
    link: "https://img.freepik.com/free-photo/abstract-autumn-beauty-multi-colored-leaf-vein-pattern-generated-by-ai_188544-9871.jpg",
    width: "500px",
    height: "500px",
  },
];

export const SliderComp: React.FC = () => {
  const [canMove, setCanMove] = useState(false);
  const sourceImageRef = useRef<any>(null);
  const overlapImageRef = useRef<any>(null);
  const draggableRef = useRef<any>(null);

  const mouseMoveHandler = (e: any) => {
    console.log(e);
    setCanMove(true);
  };

  const slideStop = () => {
    setCanMove(false);
  };

  const mouseMovingHandler = (e: any) => {
    if (!canMove) return;
    if (!overlapImageRef.current || !draggableRef.current) return;

    let pos = getCursor(e);

    let w = sourceImageRef.current.getBoundingClientRect().width;

    if (pos < 0) pos = 0;
    if (pos > w) pos = w;

    console.log("Pos", pos, w);
    slide(pos);
  };

  const slide = (x: number) => {
    overlapImageRef.current.style.width = x + "px";
    draggableRef.current.style.left = x + "px";
  };

  const getCursor = (e: any): number => {
    e = e || window.event;

    let a = sourceImageRef.current.getBoundingClientRect();

    //mouse horizonatl postion
    let x = e.pageX - a.left;

    x = x - window.scrollX;

    return x;
  };

  useEffect(() => {
    window.addEventListener("mouseup", slideStop);
    window.addEventListener("mousemove", mouseMovingHandler);

    return () => {
      window.removeEventListener("mouseup", slideStop);
      window.removeEventListener("mousemove", mouseMovingHandler);
    };
  }, [canMove]);

  return (
    <div
      style={{
        position: "relative",
        border: "4px solid black",
        width: "500px",
        height: "500px",
      }}
    >
      <div style={{ position: "absolute" }}>
        <img
          src={images[0].link}
          width={images[0].width}
          height={images[0].height}
          alt="No Images loaded"
        />
      </div>
      <div
        style={{
          position: "absolute",
          width: "50%",
          overflow: "hidden",
          top: 0,
          left: 0,
        }}
        ref={overlapImageRef}
      >
        <img
          src={images[1].link}
          width={images[1].width}
          height={images[1].height}
          alt="No Images loaded"
          ref={sourceImageRef}
        />
      </div>
      <span
        style={{
          position: "absolute",
          width: "30px",
          height: "30px",
          borderRadius: "50%",
          backgroundColor: "grey",
          cursor: "ew-resize",
          transform: "translate(-50%, -50%)",
          top: "50%",
          left: "50%",
        }}
        onMouseDown={mouseMoveHandler}
        onTouchStart={mouseMoveHandler}
        ref={draggableRef}
      ></span>
    </div>
  );
};
