"use client";
import React from "react";

import { companies, testimonials } from "@/data";
import { InfiniteMovingCards } from "./ui/InfiniteCards";

const Clients = () => {
  return (
    <section id="testimonials" className="py-20">
      <h1 className="heading">
        What collaborators <span className="text-purple">say</span>
      </h1>

      <div className="flex flex-col items-center mt-10">
        <div className="h-[50vh] md:h-[30rem] rounded-md flex flex-col antialiased items-center justify-center relative overflow-hidden">
          <InfiniteMovingCards
            items={testimonials}
            direction="right"
            speed="slow"
          />
        </div>

        <p className="uppercase tracking-widest text-xs text-center text-blue-100 mt-12 mb-6">
          Stack I build with
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
          {companies.map((company) => (
            <div
              key={company.id}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/[0.08] bg-black-200/40"
            >
              <img
                src={company.img}
                alt={company.name}
                className="md:w-7 w-5"
              />
              <span className="text-sm md:text-base text-white-100 whitespace-nowrap">
                {company.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Clients;
