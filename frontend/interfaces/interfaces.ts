export type InfoData = School[];

interface School {
  tot_enr: number;
  asian: number;
  black: number;
  hispanic: number;
  white: number;
  other: number;
  level: SchoolType;
}

export type SchoolType = "ES" | "ESMS" | "MS" | "MSHS" | "HS" | "K12" | "Other";

export interface Bounds {
  lngmin: number;
  latmin: number;
  lngmax: number;
  latmax: number;
}
