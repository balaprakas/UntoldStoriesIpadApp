export interface TextElement {
  type: 'text';
  id: string;
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  fontFamily: 'nunito' | 'playfair' | 'comic' | 'merriweather' | 'opensans';
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  textShape: 'rectangle' | 'rounded' | 'circle' | 'diamond' | 'hexagon';
  backgroundColor: string;
  color: string;
  fontSize: number;
}

export interface ImageElement {
  type: 'image';
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  imageFrame: 'none' | 'simple' | 'double' | 'dashed' | 'rounded' | 'circle' | 'vintage';
}

export type Element = TextElement | ImageElement;

export interface PageBackground {
  src: string;
  opacity: number;
}

export interface ContentPage {
  type: 'page';
  elements: Element[];
  background: PageBackground;
}

export interface CoverPage {
  type: 'cover';
  content: { title: string };
}

export interface BackCoverPage {
  type: 'back-cover';
  content: Record<string, never>;
}

export type Page = CoverPage | ContentPage | BackCoverPage;

export interface BookData {
  pages: Page[];
}
