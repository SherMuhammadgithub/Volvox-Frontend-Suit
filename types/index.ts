import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface ResearchWork {
  _id: string;
  id?: string;
  researchName: string;
  title?: string;
  fileName: string;
  file_id: string;
  extension?: string;
  fileType?: string;
  createdAt: string;
  date?: string;
}
