import React, { ReactNode } from 'react';

type CardProps = {
  title: string;
  children: ReactNode;
};

const Card: React.FC<CardProps> = ({ title, children }) => {
  return (
    <div className="border rounded-lg shadow-sm p-5 mb-6 bg-white hover:shadow-md transition-shadow">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">{title}</h2>
      <div>{children}</div>
    </div>
  );
};

export default Card;
