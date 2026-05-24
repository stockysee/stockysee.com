"use client";

import { BuilderSection } from "./sections/BuilderSection";

interface SectionRendererProps {
  section: {
    id: string;
    type: string;
    config: any;
  };
}

export default function SectionRenderer({ section }: SectionRendererProps) {
  return (
    <BuilderSection
      id={section.id}
      config={section.config}
      elements={section.config?.elements || []}
      activeElementId={null}
      isActive={false}
      readOnly={true}
      onElementSelect={() => {}}
      onSectionSelect={() => {}}
    />
  );
}
