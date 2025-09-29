"use client";

import React, { useState } from "react";

interface TabProps {
  label: string;
  children: React.ReactNode;
}

function Tab({ label, children }: TabProps) {
  return (
    <div className="tab-content">
      {children}
    </div>
  );
}

interface TabsProps {
  children: React.ReactElement<TabProps>[];
}

export function Tabs({ children }: TabsProps) {
  const [activeTab, setActiveTab] = useState(children[0]?.props.label);

  const handleClick = (label: string) => {
    setActiveTab(label);
  };

  return (
    <div className="tabs">
      <div className="flex border-b border-gray-200">
        {children.map((child) => (
          <button
            key={child.props.label}
            className={`py-2 px-4 text-sm font-medium focus:outline-none ${activeTab === child.props.label
                ? "border-b-2 border-indigo-500 text-indigo-600"
                : "text-gray-500 hover:text-gray-700"}
            `}
            onClick={() => handleClick(child.props.label)}
          >
            {child.props.label}
          </button>
        ))}
      </div>
      <div className="py-4">
        {children.map((child) => {
          if (child.props.label === activeTab) {
            return <div key={child.props.label}>{child.props.children}</div>;
          }
          return null;
        })}
      </div>
    </div>
  );
}

Tabs.Tab = Tab;


