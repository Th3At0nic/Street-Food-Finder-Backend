export type TErrorSources = { path: string; message: string }[];
export type TGenericErrorResponse = {
  status: number;
  message: string;
  error: TErrorSources;
  stack?: string | null;
};
