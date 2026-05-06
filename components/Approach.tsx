import React from "react";
import { useInView } from "./ui/useInView";
import { AnimatePresence, motion } from "framer-motion";

import { CanvasRevealEffect } from "./ui/CanvasRevealEffect";

const Approach = () => {
  return (
    <section className="w-full py-20" id="approach">
      <h1 className="heading">
        How I <span className="text-purple">build systems</span>
      </h1>
      <p className="text-center text-white-200 mt-6 max-w-2xl mx-auto">
        Every project I ship moves through three engineering gates. No code is
        written until the system is decomposed, the data is modelled, and the
        scale envelope is understood.
      </p>
      <div className="my-20 flex flex-col lg:flex-row items-center justify-center w-full gap-4">
        <Card
          title="PRD · HLD · LLD"
          icon={<AceternityIcon order="Phase 1" />}
          des="Product requirements decomposed into a high-level architecture, then drilled down into LLD: data model, API surface, sequence diagrams, auth boundaries, and failure modes — before sprint zero."
        >
          <CanvasRevealEffect
            animationSpeed={5.1}
            containerClassName="bg-emerald-900 rounded-3xl overflow-hidden"
          />
        </Card>
        <Card
          title="Implementation & Engineering Excellence"
          icon={<AceternityIcon order="Phase 2" />}
          des="TypeScript-strict, server-first, validated at every boundary. Modular, testable, observable. Each PR ships with the architectural rationale documented — code that future-you and future-team can reason about."
        >
          <CanvasRevealEffect
            animationSpeed={5.1}
            containerClassName="bg-pink-900 rounded-3xl overflow-hidden"
            colors={[
              [255, 166, 158],
              [221, 255, 247],
            ]}
            dotSize={2}
          />
        </Card>
        <Card
          title="Scale, Ops & Observability"
          icon={<AceternityIcon order="Phase 3" />}
          des="Caching, rate limits, queues, RBAC, audit trails, structured logs, error tracking, deploy pipelines. The system isn't done at v1 — it's done when it survives prod, scales, and someone else can own it."
        >
          <CanvasRevealEffect
            animationSpeed={5.1}
            containerClassName="bg-sky-600 rounded-3xl overflow-hidden"
            colors={[[125, 211, 252]]}
          />
        </Card>
      </div>
    </section>
  );
};

export default Approach;

const Card = ({
  title,
  icon,
  children,
  des,
}: {
  title: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
  des: string;
}) => {
  const [hovered, setHovered] = React.useState(false);
  const { ref, isInView } = useInView({ threshold: 0.5 });
  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="border border-black/[0.2] group/canvas-card flex items-center justify-center
       dark:border-white/[0.2]  max-w-sm w-full mx-auto p-4 relative lg:h-[35rem] rounded-3xl "
      style={{
        background: "rgb(4,7,29)",
        backgroundColor:
          "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
      }}
    >
      <Icon className="absolute h-10 w-10 -top-3 -left-3 dark:text-white text-black opacity-30" />
      <Icon className="absolute h-10 w-10 -bottom-3 -left-3 dark:text-white text-black opacity-30" />
      <Icon className="absolute h-10 w-10 -top-3 -right-3 dark:text-white text-black opacity-30" />
      <Icon className="absolute h-10 w-10 -bottom-3 -right-3 dark:text-white text-black opacity-30" />

      <AnimatePresence>
        {isInView ? (
          <div>
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full w-full absolute inset-0"
              >
                {children}
              </motion.div>
            </AnimatePresence>

            <div className="relative z-20 px-10">
              <div
                className="text-center -translate-y-4 absolute top-[50%] left-[50%] translate-x-[-50%]
        opacity-0 transition duration-200 min-w-40 mx-auto flex items-center justify-center"
              >
                {icon}
              </div>
              <h2
                className="dark:text-white text-center text-3xl opacity-100
         relative z-10  mt-4  font-bold text-white
         group-hover/canvas-card:-translate-y-2 transition duration-200"
              >
                {title}
              </h2>
              <p
                className="text-sm  opacity-100
         relative z-10 mt-4 text-white text-center
         group-hover/canvas-card:-translate-y-2 transition duration-200"
                style={{ color: "#E4ECFF" }}
              >
                {des}
              </p>
            </div>
          </div>
        ) : (
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full w-full absolute inset-0"
            >
              {children}
            </motion.div>
            <div className="relative z-20 px-10">
              <div
                className="text-center group-hover/canvas-card:-translate-y-4 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]
        group-hover/canvas-card:opacity-0 transition duration-200 min-w-40 mx-auto flex items-center justify-center"
              >
                {icon}
              </div>
              <h2
                className="dark:text-white text-center text-3xl opacity-0 group-hover/canvas-card:opacity-100
         relative z-10 text-black mt-4  font-bold group-hover/canvas-card:text-white
         group-hover/canvas-card:-translate-y-2 transition duration-200"
              >
                {title}
              </h2>
              <p
                className="text-sm opacity-0 group-hover/canvas-card:opacity-100
         relative z-10 mt-4 group-hover/canvas-card:text-white text-center
         group-hover/canvas-card:-translate-y-2 transition duration-200"
                style={{ color: "#E4ECFF" }}
              >
                {des}
              </p>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AceternityIcon = ({ order }: { order: string }) => {
  return (
    <div>
      <button className="relative inline-flex overflow-hidden rounded-full p-[1px] ">
        <span
          className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite]
         bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]"
        />
        <span
          className="inline-flex h-full w-full cursor-pointer items-center
        justify-center rounded-full bg-slate-950 px-5 py-2 text-purple backdrop-blur-3xl font-bold text-2xl"
        >
          {order}
        </span>
      </button>
    </div>
  );
};

export const Icon = ({ className, ...rest }: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={className}
      {...rest}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
  );
};
