import { createElement, type ComponentType, type ReactNode } from "react";
import { HeaderBlock, SimpleBlockC, SimpleBlockD } from "@/editor/components";
import { SimpleBlockA } from "@/editor/components/SimpleBlockA";
import { SimpleBlockB } from "@/editor/components/SimpleBlockB";

export type BlockLibraryItem = {
  id: string;
  title: string;
  description: string;
  componentName: string;
  component: ComponentType;
  showInGallery?: boolean;
};

export const BLOCK_LIBRARY: BlockLibraryItem[] = [
  {
    id: "header-block",
    title: "Hero Header",
    description: "Шапка с крупным заголовком, подписью и CTA-кнопками",
    componentName: "HeaderBlock",
    component: HeaderBlock,
    showInGallery: false,
  },
  {
    id: "simple-block-a",
    title: "Grid Layout",
    description: "Шаблон с героем, карточками возможностей и CTA",
    componentName: "SimpleBlockA",
    component: SimpleBlockA,
  },
  {
    id: "simple-block-b",
    title: "Sidebar Design",
    description: "Лэйаут с панелью навигации и контентной областью",
    componentName: "SimpleBlockB",
    component: SimpleBlockB,
  },
  {
    id: "simple-block-c",
    title: "Template Gallery",
    description: "Каталог шаблонов с ховерами и карточками",
    componentName: "SimpleBlockC",
    component: SimpleBlockC,
  },
  {
    id: "simple-block-d",
    title: "Content Hub",
    description: "Герой с описанием и контентными блоками",
    componentName: "SimpleBlockD",
    component: SimpleBlockD,
  },
];

export const BLOCK_COMPONENT_MAP: Record<string, ComponentType> = BLOCK_LIBRARY.reduce(
  (acc, block) => {
    acc[block.componentName] = block.component;
    return acc;
  },
  {} as Record<string, ComponentType>
);

export const createBlockElement = (componentName: string): ReactNode => {
  const Component = BLOCK_COMPONENT_MAP[componentName];
  return Component ? createElement(Component) : null;
};
